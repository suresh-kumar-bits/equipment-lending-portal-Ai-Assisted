# Testing Guide - Quantity Feature

## 1. Equipment Quantity Tests

### Backend Tests

#### Equipment Model Tests
```javascript
describe('Equipment Model Quantity Tests', () => {
  test('should validate quantity is a positive integer', () => {
    const equipment = new Equipment({
      ...validEquipmentData,
      quantity: -1
    });
    expect(equipment.validateSync().errors.quantity).toBeDefined();
  });

  test('should validate available is less than or equal to quantity', () => {
    const equipment = new Equipment({
      ...validEquipmentData,
      quantity: 5,
      available: 6
    });
    expect(equipment.validateSync().errors.available).toBeDefined();
  });
});
```

#### Request Controller Tests
```javascript
describe('Request Controller Quantity Tests', () => {
  test('should validate requested quantity against availability', async () => {
    const response = await request(app)
      .post('/api/requests/create')
      .send({
        ...validRequestData,
        quantity: equipment.available + 1
      });
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Only');
  });

  test('should allow multiple requests if enough quantity available', async () => {
    // First request
    const response1 = await request(app)
      .post('/api/requests/create')
      .send({
        ...validRequestData,
        quantity: 2
      });
    expect(response1.status).toBe(201);

    // Second request
    const response2 = await request(app)
      .post('/api/requests/create')
      .send({
        ...validRequestData,
        quantity: 1
      });
    expect(response2.status).toBe(201);
  });

  test('should update availability after approval', async () => {
    const request = await Request.create({
      ...validRequestData,
      quantity: 2
    });
    
    const beforeQuantity = await Equipment.findById(request.equipmentId).available;
    
    await requestController.approveRequest(request._id);
    
    const afterQuantity = await Equipment.findById(request.equipmentId).available;
    expect(afterQuantity).toBe(beforeQuantity - 2);
  });
});
```

### Frontend Tests

#### BorrowEquipment Component Tests
```javascript
describe('BorrowEquipment Component Quantity Tests', () => {
  test('should show quantity selector for available equipment', () => {
    render(<BorrowEquipment equipment={mockEquipment} />);
    expect(screen.getByLabelText(/quantity to borrow/i)).toBeInTheDocument();
  });

  test('should limit quantity options to available amount', () => {
    render(<BorrowEquipment equipment={mockEquipment} />);
    const options = screen.getAllByRole('option');
    expect(options.length).toBe(mockEquipment.available);
  });

  test('should send correct quantity in borrow request', async () => {
    const mockSubmit = jest.fn();
    render(<BorrowEquipment onSubmit={mockSubmit} />);
    
    userEvent.selectOptions(
      screen.getByLabelText(/quantity/i),
      '2'
    );
    
    userEvent.click(screen.getByText(/submit/i));
    
    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ quantity: 2 })
    );
  });
});
```

#### RequestsManagement Component Tests
```javascript
describe('RequestsManagement Component Quantity Tests', () => {
  test('should display requested quantity in request list', () => {
    render(<RequestsManagement requests={mockRequests} />);
    expect(screen.getByText('2 units')).toBeInTheDocument();
  });

  test('should show available quantity in equipment details', () => {
    render(<RequestsManagement requests={mockRequests} />);
    expect(screen.getByText(/available:/i)).toHaveTextContent('8');
  });
});
```

## 2. Manual Testing Checklist

### Equipment Management
- [ ] Add new equipment with quantity
- [ ] Edit equipment quantity
- [ ] Verify available quantity updates correctly
- [ ] Verify quantity validation on form submission

### Borrowing Flow
- [ ] Select equipment and check quantity options
- [ ] Verify quantity selector shows correct available amount
- [ ] Submit borrow request with different quantities
- [ ] Check validation for quantities exceeding availability

### Request Management
- [ ] View request with quantity information
- [ ] Approve request and verify equipment availability updates
- [ ] Check overlapping request handling
- [ ] Verify quantity restored when request is rejected

### Edge Cases
- [ ] Try to borrow more than available
- [ ] Multiple requests for same equipment
- [ ] Zero quantity validation
- [ ] Negative quantity validation

## 3. Integration Testing

### Equipment Availability Flow
1. Add equipment with quantity 10
2. Submit borrow request for 3 units
3. Approve request
4. Verify available quantity is 7
5. Submit another request for 4 units
6. Verify it succeeds
7. Try to submit request for 4 units
8. Verify it fails (only 3 available)

### Multiple Request Scenarios
1. Create equipment with quantity 5
2. Submit concurrent requests:
   - Request 1: 2 units
   - Request 2: 2 units
   - Request 3: 2 units
3. Verify only first two succeed
4. Approve first request
5. Verify quantity updates
6. Verify third request still fails

### Return Flow
1. Borrow 3 units of equipment
2. Approve request
3. Mark as returned
4. Verify quantity restores to original
5. Verify can borrow again