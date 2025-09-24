import './Dashboard.css';

function Login() {
  const validateLogin = () => {
    alert("Login button clicked!");
  };

  return (
    <div>
      <div className="loginbox">
        <h4>Enter your Details</h4>
        <input type="text" placeholder="Enter your account name" />
        <input type="password" placeholder="Enter your password" />
        <button className="Login" onClick={validateLogin}>
          Log in
        </button>
        <a className="Forgot" href="">
          Forgotten Password?
        </a>
      </div>
    </div>
  );
}

export default Login;
