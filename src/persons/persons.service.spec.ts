describe('PersonsService', () => {
  beforeEach(async () => {
    //console.log('This will be executed before each test');
  });

  it('should sum numberOne with numberTwo and result in 3', () => {
    // configure - Arrange
    const numberOne = 1;
    const numberTwo = 2;

    // Do some action - Act
    const result = numberOne + numberTwo;

    // Check if this action was expected - Assert
    expect(result).toBe(3); // is expected: === 3
  });
});
