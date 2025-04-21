describe("getProjectsValidator() getProjectsValidator method", () => {
  const { getProjectsValidator } = projectValidation;

  // Helper function to simulate validation
  const runValidator = async (validator, reqBody) => {
    const req = { body: reqBody };
    const res = {};
    const next = jest.fn();
    await Promise.all(validator.map((v) => v.run(req, res, next)));
    return next;
  };

  describe("Happy paths", () => {
    it("should pass validation when email is provided and valid", async () => {
      // Test description: Validates that a valid email passes the validation
      const reqBody = { email: "test@example.com" };
      const next = await runValidator(getProjectsValidator(), reqBody);
      expect(next).toHaveBeenCalledWith();
    });

    it("should pass validation when username is provided and valid", async () => {
      // Test description: Validates that a valid username passes the validation
      const reqBody = { username: "validusername" };
      const next = await runValidator(getProjectsValidator(), reqBody);
      expect(next).toHaveBeenCalledWith();
    });

    it("should pass validation when both email and username are provided and valid", async () => {
      // Test description: Validates that both email and username being valid passes the validation
      const reqBody = { email: "test@example.com", username: "validusername" };
      const next = await runValidator(getProjectsValidator(), reqBody);
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe("Edge cases", () => {
    it("should fail validation when neither email nor username is provided", async () => {
      // Test description: Validates that an error is thrown when neither email nor username is provided
      const reqBody = {};
      const next = await runValidator(getProjectsValidator(), reqBody);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should fail validation when email is invalid", async () => {
      // Test description: Validates that an invalid email fails the validation
      const reqBody = { email: "invalid-email" };
      const next = await runValidator(getProjectsValidator(), reqBody);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should fail validation when username is not lowercase", async () => {
      // Test description: Validates that a non-lowercase username fails the validation
      const reqBody = { username: "InvalidUsername" };
      const next = await runValidator(getProjectsValidator(), reqBody);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should fail validation when email is empty", async () => {
      // Test description: Validates that an empty email fails the validation
      const reqBody = { email: "" };
      const next = await runValidator(getProjectsValidator(), reqBody);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should fail validation when username is empty", async () => {
      // Test description: Validates that an empty username fails the validation
      const reqBody = { username: "" };
      const next = await runValidator(getProjectsValidator(), reqBody);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
