## Project Idea
This project is a personalized UV-protection platform that helps users understand how long they can safely stay under the sun based on their skin type and current UV index. The application provides real-time exposure recommendations, sunscreen (SPF) guidance, burn-risk levels, and optional daily UV alerts via email. Designed with a privacy-first approach, the dashboard delivers actionable sun-safety insights without requiring public user profiles.

>## Project Status
> This project is currently in the **ideation and development phase**.
> The architecture and features are continuously being improved.

- [x] ~~JWT based authentication~~ (plan scrached)
- [x] Password-less authentication using resend.
- [x] setting up a resend sender for local developement.
- [x] Add authentication middleware for sessiontoken.
- [x] add sample protected route.
- [x] explore the APIs for uv index.
- [x] explore the APIs for cloud & other parameters.
- [x] explore the docs of [open meteo](https://open-meteo.com/en/docs).
- [x] complete the magic link flow.
- [x] add rate limiting to the critical endpoint.
- [ ] add magic link token expiry logic.
- [ ] add validation for email in the /register endpoint.
- [ ] add a type field in the token generation to distinguish between session token and magic-link token.
