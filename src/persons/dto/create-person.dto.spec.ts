import { validate } from 'class-validator';
import { CreatePersonDto } from './create-person.dto';

describe('CreatePersonDto', () => {
  it('should validate a valid DTO', async () => {
    const dto = new CreatePersonDto();
    dto.email = 'test@example.com';
    dto.password = '123456';
    dto.name = 'Pedro Miranda';

    const errors = await validate(dto);
    expect(errors.length).toBe(0); // No error means that the DTO is valid
  });

  it('should fail if the email is invalid', async () => {
    const dto = new CreatePersonDto();
    dto.email = 'email-invalid';
    dto.password = 'pass123';
    dto.name = 'Pedro Miranda';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should fail if the password is too short', async () => {
    const dto = new CreatePersonDto();
    dto.email = 'test@example.com';
    dto.password = '123';
    dto.name = 'Pedro Miranda';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
  });

  it('should fail if the name is empty', async () => {
    const dto = new CreatePersonDto();
    dto.email = 'test@example.com';
    dto.password = 'pass123';
    dto.name = '';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
  });

  it('should fail if the name is too long', async () => {
    const dto = new CreatePersonDto();
    dto.email = 'test@example.com';
    dto.password = 'pass123';
    dto.name = 'a'.repeat(101);

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
  });
});
