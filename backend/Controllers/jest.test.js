const { login } = require('./UserController');

test('tests login function', async () => {

  const req = { body: { email: "pilling2003@gmail.com", password: "Pass123!" } };
  const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
  };

  await login(req, res);
  expect(res.status).toHaveBeenCalledWith(201);

}, 90000);
