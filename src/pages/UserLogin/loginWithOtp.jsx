const LoginWithOtp = () => {
  return (
    <div>
      <div className="text-sm">
        <p>
   
          Want to login with email and password{" "}
          <span onClick={() => setLogin(true)} className="text-red-400">
            click here
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginWithOtp;
