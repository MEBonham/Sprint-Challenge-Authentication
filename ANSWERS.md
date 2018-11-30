<!-- Answers to the Short Answer Essay Questions go here -->

1. What is the purpose of using _sessions_?

Sessions are a way for the server side to keep track of authentication. They let the user stay logged in while leaving full control of who's logged in and who's not in the hands of the server.

2. What does bcrypt do to help us store passwords in a secure manner.

It hashes them, which is a one-way process that can't be reversed to find the original password.

3. What does bcrypt do to slow down attackers?

It hashes repeatedly for a number of rounds, making brute-force approaches take 2^rounds times as long to guess a password.

4. What are the three parts of the JSON Web Token?

Payload, secret, and options.