(() => {
  const form = document.querySelector('form');
  const formResponse = document.querySelector('#js-form-response');

  form.onsubmit = (e) => {
    e.preventDefault();

    // Prepare data to send
    const data = {};
    const formElements = Array.from(form);
    formElements.forEach((input) => {
      if (input.name) {
        data[input.name] = input.value;
      }
    });

    // Get reCAPTCHA token from widget
    const recaptchaToken = grecaptcha.getResponse();
    if (!recaptchaToken) {
      formResponse.innerHTML = 'Please verify that you’re not a robot.';
      return;
    }
    data['g-recaptcha-response'] = recaptchaToken;

    // Check for honeypot value (_gotcha field)
    if (data._gotcha) {
      // It's a bot; reject the submission
      console.log('Spam detected, form not submitted');
      return; // Prevent further form submission
    }

    // Custom message validation: message must contain non-whitespace characters
    if (!data.message || data.message.trim().length === 0) {
      console.log('Empty or invalid message blocked.');
      formResponse.innerHTML = 'Please enter a valid message.';
      return;
    }

    //Prevents too short messages
    if (data.message.trim().length < 10) {
      formResponse.innerHTML = 'Please enter a longer message.';
      return;
    }

    // Log what our lambda function will receive
    console.log(JSON.stringify(data));

    // Construct an HTTP request
    const xhr = new XMLHttpRequest();
    xhr.open(form.method, form.action, true);
    xhr.setRequestHeader('Accept', 'application/json; charset=utf-8');
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    // Send the collected data as JSON
    xhr.send(JSON.stringify(data));

    // Callback function
    xhr.onloadend = (response) => {
      if (response.target.status === 200) {
        // The form submission was successful
        form.reset();
        formResponse.innerHTML =
          'Thanks for the message. I’ll be in touch shortly.';
      } else {
        // The form submission failed
        formResponse.innerHTML = 'Something went wrong';
        console.error(JSON.parse(response.target.response).message);
      }
    };
  };
})();
