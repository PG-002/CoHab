const { createToken } = require('../Middleware/Token');
const { login } = require('./UserController');

jest.mock('backend/Models/User.js', () => ({
  findOne: jest.fn().mockImplementation((input) => {
    if (input.email === "pilling2003@gmail.com") {
      return Promise.resolve({
          _id: {
            $oid: "6606088c8e5a74f63d8c2cf8"
          },
          firstName: "Evan",
          lastName: "Pilling",
          email: "pilling2003@gmail.com",
          password: "$2b$05$ICiQB9IMOykn7NRaQB8dVeUtavbfHGnGV7zx7.LrDCpmwYrCT/lBy",
          houseID: "65ee23ed93e64439604ca9db",
          location: {
            lastUpdated: {
              $date: "2024-04-20T03:21:34.403Z"
            },
            latitude: 11111,
            longitude: 33333,
            isTracking: true
          },
          verified: true,
          houseId: "65ee23ed93e64439604ca9db"
      });
    } else if (input.email === "ryanpgarfinkel@gmail.com") {
        return Promise.resolve({
          _id: {
            $oid: "65f1fe767c78fd210515c682"
          },
          firstName: "Ryan",
          lastName: "Garfinkel",
          email: "ryanpgarfinkel@gmail.com",
          password: "$2b$05$ojeqWifkZfacoF9uvuWrCuNR3scD/RPqEemrwAwWNyN8s3f9HwhWq",
          houseID: null,
          location: {
            lastUpdated: {
              $date: "2024-04-18T17:28:43.964Z"
            },
            lattitude: 0,
            longitude: -81.1981047,
            isTracking: true,
            latitude: 28.6020821
          },
          verified: true,
          houseId: "6614754027982cff3b0c8c10"
        });
    } else {
      return Promise.resolve(null);
    }
  }
)}))

jest.mock('backend/Middleware/PasswordHash.js', () => ({
  compare: jest.fn((inputPassword, storedPassword) => {
    return Promise.resolve({ match: true, error: '' });
  })
}));

test('tests login using correct email', async () => {

  let status = 0;
  let resObj = null;
  const req = { body: { email: "pilling2003@gmail.com", password: "Pass123!" } };
  const res = {
    status: (val) => status = val,
    json: (obj) => resObj = obj
};

  await login(req, res);
  expect(status).toEqual(201);

});

test('tests login using different correct email', async () => {

  let status = 0;
  let resObj = null;
  const req = { body: { email: "ryanpgarfinkel@gmail.com", password: "Pass123!" } };
  const res = {
    status: (val) => status = val,
    json: (obj) => resObj = obj
};

  await login(req, res);
  expect(status).toEqual(201);

});

test('tests login using wrong email', async () => {

  let status = 0;
  let resObj = null;
  const req = { body: { email: "wrongEmail", password: "Pass123!" } };
  const res = {
    status: (val) => status = val,
    json: (obj) => resObj = obj
};

  await login(req, res);
  expect(status).toEqual(404);

});

