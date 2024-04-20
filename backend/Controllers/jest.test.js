const { login } = require('./UserController');

test('tests login function', async () => {

  let status = 0;
  let resObj = null;
  const req = { body: { email: "pilling2003@gmail.com", password: "Pass123!" } };
  const res = {
    status: (val) => status = val,
    json: (obj) => resObj = obj
};

  await login(req, res);
  expect(res.status).toEqual(201);

}, 90000);

