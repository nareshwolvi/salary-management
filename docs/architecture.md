# Architecture

## Overview

The application uses a modular monolith architecture with a React frontend,
Node.js/Express backend, and PostgreSQL relational database.

## Architecture

```text
HR Manager
    |
    v
React + TypeScript
    |
    | REST / JSON
    v
Node.js + Express + TypeScript
    |
    | Prisma
    v
PostgreSQL