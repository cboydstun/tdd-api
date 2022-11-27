import React from 'react'

export default function Contact() {
  //contact form should not redirect on submit
  const handleSubmit = (e) => {
    e.preventDefault();
    postData();
  }

  //define async function to post data to api/v1/contact
  const postData = async () => {
    const response = await fetch("/api/v1/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: document.getElementById("from").value,
        subject: document.getElementById("subject").value,
        text: document.getElementById("text").value,
      }),
    });
    const data = await response.json();
    if(data) {
      alert("Email sent successfully");
    }
  };

  return (
    <div>
        <h1>Contact</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor="from">From</label>
            <input type="email" id="from" name="from" />
            <label htmlFor="subject">Subject</label>
            <input type="text" id="subject" name="subject" />
            <label htmlFor="text">Text</label>
            <input id="text" name="text" />
            <button type="submit">Submit</button>
        </form>
    </div>
  );
}

