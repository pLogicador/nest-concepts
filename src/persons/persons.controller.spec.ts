import { PersonsController } from './persons.controller';

describe('PersonsController', () => {
  let controller: PersonsController;
  const personsServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    uploadPicture: jest.fn(),
  };

  beforeEach(() => {
    controller = new PersonsController(personsServiceMock as any);
  });

  it('create - should use PersonService with the correct argument', async () => {
    const argument = { key: 'value' };
    const expected = { anyKey: 'anyValue' };

    jest.spyOn(personsServiceMock, 'create').mockResolvedValue(expected);

    const result = await controller.create(argument as any);

    expect(personsServiceMock.create).toHaveBeenCalledWith(argument);
    expect(result).toEqual(expected);
  });

  it('findAll - should use PersonService', async () => {
    const expected = { anyKey: 'anyValue' };

    jest.spyOn(personsServiceMock, 'findAll').mockResolvedValue(expected);

    const result = await controller.findAll();

    expect(personsServiceMock.create).toHaveBeenCalled();
    expect(result).toEqual(expected);
  });

  it('findOne - should use PersonService with the correct argument', async () => {
    const argument = '1';
    const expected = { anyKey: 'anyValue' };

    jest.spyOn(personsServiceMock, 'findOne').mockResolvedValue(expected);

    const result = await controller.findOne(argument as any);

    expect(personsServiceMock.findOne).toHaveBeenCalledWith(+argument);
    expect(result).toEqual(expected);
  });

  it('update - should use PersonService with the correct argument', async () => {
    const argument1 = '1';
    const argument2 = { key: 'value' };
    const argument3 = { key: 'value' };
    const expected = { anyKey: 'anyValue' };

    jest.spyOn(personsServiceMock, 'update').mockResolvedValue(expected);

    const result = await controller.update(
      argument1,
      argument2 as any,
      argument3 as any,
    );

    expect(personsServiceMock.update).toHaveBeenCalledWith(
      +argument1,
      argument2,
      argument3,
    );
    expect(result).toEqual(expected);
  });

  it('remove - should use PersonService with the correct argument', async () => {
    const argument1 = 1;
    const argument2 = { aKey: 'aValue' };
    const expected = { anyKey: 'anyValue' };

    jest.spyOn(personsServiceMock, 'remove').mockResolvedValue(expected);

    const result = await controller.remove(argument1 as any, argument2 as any);

    expect(personsServiceMock.remove).toHaveBeenCalledWith(
      +argument1,
      argument2,
    );
    expect(result).toEqual(expected);
  });

  it('uploadPicture - should use PersonService with the correct argument', async () => {
    const argument1 = { aKey: 'aValue' };
    const argument2 = { bKey: 'bValue' };
    const expected = { anyKey: 'anyValue' };

    jest.spyOn(personsServiceMock, 'uploadPicture').mockResolvedValue(expected);

    const result = await controller.uploadPicture(
      argument1 as any,
      argument2 as any,
    );

    expect(personsServiceMock.uploadPicture).toHaveBeenCalledWith(
      argument1,
      argument2,
    );
    expect(result).toEqual(expected);
  });
});
