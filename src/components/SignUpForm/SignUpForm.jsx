import { Link, useNavigate } from "react-router-dom";
import styles from "./SignUpForm.module.css";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUpForm = () => {
  const navigate = useNavigate();
  const Notify = (message, type) => {
    if (type === "success") {
      return toast.success(message, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      return toast.error(message, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function validatePassword(password) {
    const failedPolicies = [];
    if (password.length < 8) {
      failedPolicies.push("Password must be at least 8 characters long");
    }
    if (!/[a-z]/.test(password)) {
      failedPolicies.push(
        "Password must contain at least one lowercase letter"
      );
    }
    if (!/[A-Z]/.test(password)) {
      failedPolicies.push(
        "Password must contain at least one uppercase letter"
      );
    }
    if (!/\d/.test(password)) {
      failedPolicies.push("Password must contain at least one digit");
    }
    return failedPolicies;
  }

  const [enteredName, setEnteredName] = useState("");
  const [nameInputTouched, setNameInputTouched] = useState(false);
  const nameInputIsInvalid =
    enteredName.trim().split(" ").length < 3 && nameInputTouched;

  const [enteredEmail, setEnteredEmail] = useState("");
  const [emailInputTouched, setEmailInputTouched] = useState(false);
  const emailIsValid = validateEmail(enteredEmail);
  const emailInputIsInvalid = !emailIsValid && emailInputTouched;

  const [enteredPassword, setEnteredPassword] = useState("");
  const [passwordInputTouched, setPasswordInputTouched] = useState(false);
  const passwordIsValid = validatePassword(enteredPassword).length === 0;
  const passwordInputIsInvalid = !passwordIsValid && passwordInputTouched;

  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");
  const [confirmPasswordInputTouched, setConfirmPasswordInputTouched] =
    useState(false);
  const confirmPasswordIsValid = enteredConfirmPassword === enteredPassword;
  const confirmPasswordInputIsInvalid =
    !confirmPasswordIsValid && confirmPasswordInputTouched;

  const [isLoading, setisLoading] = useState(false);

  const nameInputChangeHandler = (event) => {
    setEnteredName(event.target.value);
    setNameInputTouched(true);
  };
  const nameInputBlurHandler = (event) => {
    setNameInputTouched(true);
  };

  const emailInputChangeHandler = (event) => {
    setEnteredEmail(event.target.value);
  };
  const emailInputBlurHandler = (event) => {
    setEmailInputTouched(true);
  };

  const passwordInputChangeHandler = (event) => {
    setEnteredPassword(event.target.value);
  };
  const passwordInputBlurHandler = (event) => {
    setPasswordInputTouched(true);
  };

  const confirmPasswordInputChangeHandler = (event) => {
    setEnteredConfirmPassword(event.target.value);
  };
  const confirmPasswordInputBlurHandler = (event) => {
    setConfirmPasswordInputTouched(true);
  };

  const formSubmissionHandler = (event) => {
    event.preventDefault();

    setNameInputTouched(true);
    setEmailInputTouched(true);
    setPasswordInputTouched(true);

    if (enteredName.trim().split(" ").length < 3) {
      return;
    }
    if (!emailIsValid) {
      return;
    }
    if (!passwordIsValid) {
      return;
    }

    if (!confirmPasswordIsValid) {
      return;
    }

    setisLoading(true);

    const SignUpDto = {
      fullName: enteredName,
      email: enteredEmail,
      password: enteredPassword,
    };
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(SignUpDto),
    })
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          if (data.message === "Username already exists") {
            Notify(data.message, "error");
          }
          navigate("/login");
        } else {
          const error = await response.text();
          Notify(error, "error");
          }
      })
      .finally(() => {
        setisLoading(false);
      });
    setEnteredName("");
    setNameInputTouched(false);
    setEnteredEmail("");
    setEmailInputTouched(false);
    setEnteredPassword("");
    setPasswordInputTouched(false);
    setEnteredConfirmPassword("");
    setConfirmPasswordInputTouched(false);
  };

  const passwordInfo = (
    <ul style={{ paddingLeft: "30px" }}>
      {validatePassword(enteredPassword).map((policy, index) => (
        <li className={styles["error-text"]} key={index}>
          {policy}
        </li>
      ))}
    </ul>
  );


  return (
    <div className={styles.signUpForm}>
      <div className={styles["form-container"]}>
        <h1>Create an account</h1>
        <form onSubmit={formSubmissionHandler}>
          <div className={styles.inputContainer}>
            <label htmlFor="name" className={styles.hidden}>
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Name"
              value={enteredName}
              onChange={nameInputChangeHandler}
              onBlur={nameInputBlurHandler}
              aria-invalid={nameInputIsInvalid}
              aria-describedby={nameInputIsInvalid ? "nameError" : null}
            />
            {nameInputIsInvalid && (
              <p id="nameError" className={styles["error-text"]}>
                Please enter you full name
              </p>
            )}
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="email" className={styles.hidden}>
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={enteredEmail}
              onBlur={emailInputBlurHandler}
              onChange={emailInputChangeHandler}
              aria-invalid={emailInputIsInvalid}
              aria-describedby={emailInputIsInvalid ? "emailError" : null}
            />
            {emailInputIsInvalid && (
              <p id="emailError" className={styles["error-text"]}>
                Please enter a valid email
              </p>
            )}
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="password" className={styles.hidden}>
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={enteredPassword}
              onBlur={passwordInputBlurHandler}
              onChange={passwordInputChangeHandler}
              aria-invalid={passwordInputIsInvalid}
              aria-describedby={passwordInputIsInvalid ? "passwordError" : null}
            />
            {passwordInputIsInvalid && (
              <div id="passwordError" className={styles["error-text"]}>
                {passwordInfo}
              </div>
            )}
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="confirmPassword" className={styles.hidden}>
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm password"
              value={enteredConfirmPassword}
              onBlur={confirmPasswordInputBlurHandler}
              onChange={confirmPasswordInputChangeHandler}
              aria-invalid={confirmPasswordInputIsInvalid}
              aria-describedby={
                confirmPasswordInputIsInvalid ? "confirmPasswordError" : null
              }
            />
            {confirmPasswordInputIsInvalid && (
              <p id="confirmPasswordError" className={styles["error-text"]}>
                Passwords do not match
              </p>
            )}
          </div>
          <button
            className={styles["form-submit"]}
            disabled={isLoading}
            type="submit"
          >
            Create Account
          </button>
        </form>
        <div className={styles.login}>
          <p>Already have an account? <Link to="/login">
            <u>Login</u>
          </Link> </p>
          
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUpForm;

// email confimation
