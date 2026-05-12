# Project Name

> _A brief description of your project or what it does._

## 🚀 Getting Started

Follow these steps to set up the development environment.

### 1. Install Mise

Install the `mise` CLI by following the official guide:

👉 [Installing `mise` CLI](https://mise.jdx.dev/getting-started.html#installing-mise-cli)

### 2. Activate Mise

Enable `mise` in your shell session:

```sh
mise activate [FLAGS] [SHELL_TYPE]
```

Alternatively, you can append it to your shell's rc file (example below uses bash):

```sh
echo 'eval "$(mise activate bash)"' >> ~/.bashrc
```

More details: 👉 [Activating `mise`](https://mise.jdx.dev/cli/activate.html)

### 3. Install Required Tools

Install the toolchain defined in `mise.toml`:

```sh
mise install
```

### 4. Install Project Dependencies

Install all dependencies using `pnpm`:

```sh
pnpm install
```

## 🛠️ Additional Notes

- `mise` ensures that the correct versions of tools are used as defined in the project.
