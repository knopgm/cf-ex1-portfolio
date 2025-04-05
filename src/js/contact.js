(() => {
  const form = document.querySelector('form');
  const formResponse = document.querySelector('js-form-response');

  form.onsubmit = (e) => {
    e.preventDefault();

    if (e.body._gotcha) {
      // It's a bot; reject the submission
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Spam detected' }),
      };
    }

    // Prepare data to send
    const data = {};
    const formElements = Array.from(form);
    formElements.map((input) => (data[input.name] = input.value));

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
