const payload = {
  name: "TestUser",
  email: "test@example.com",
  password: "password123",
};

const response = await fetch("http://localhost:5000/api-v1/auth/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});

console.log(response.status);
console.log(await response.text());
