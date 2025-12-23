# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Environment and MongoDB Atlas (required)

This project requires a MongoDB Atlas connection for the backend. Please:

- Create a MongoDB Atlas cluster and a database user with `readWrite` privileges on your database.
- Add your current machine IP (or CI IPs) to the Network Access whitelist in Atlas.
- Set the connection string in `backend/.env` as `MONGO_URI` (a sample is in `backend/.env.example`).

Important security notes:

- **Rotate the DB user password** if credentials were accidentally committed to source.
- Keep `backend/.env` out of version control; use a secret manager in production (e.g., GitHub Secrets, AWS Secrets Manager, Azure Key Vault).

