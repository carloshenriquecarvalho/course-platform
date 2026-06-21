# Course Platform

Plataforma de cursos online desenvolvida com Next.js, TypeScript, Prisma e PostgreSQL (Supabase).

## Sobre o Projeto

O objetivo deste projeto é fornecer uma plataforma completa para disponibilização e gerenciamento de cursos online, incluindo autenticação de usuários, controle de acesso por perfil, gerenciamento de matrículas e integração com provedores de pagamento.

A plataforma está sendo construída com foco em escalabilidade, segurança e boas práticas de desenvolvimento de software.

## Tecnologias Utilizadas

* Next.js
* TypeScript
* Prisma ORM
* PostgreSQL
* Supabase
* Auth.js (planejado)
* Kiwify Webhooks (planejado)

## Funcionalidades

### Implementadas

* Estrutura inicial do projeto
* Integração com PostgreSQL via Supabase
* ORM Prisma configurado
* CRUD básico de usuários
* Arquitetura baseada em Services, Repositories e DTOs

### Em Desenvolvimento

* Autenticação e autorização
* Controle de permissões por perfil (Admin, Instructor e User)
* Área do aluno
* Área administrativa
* Gerenciamento de cursos
* Gerenciamento de aulas
* Matrículas automáticas
* Integração com Kiwify
* Envio de e-mails automáticos
* Recuperação de senha

## Arquitetura

```text
Route
 ↓
Service
 ↓
Repository
 ↓
Prisma
 ↓
PostgreSQL (Supabase)
```

## Estrutura do Projeto

```text
app/
├── api/

lib/
├── prisma.ts

mappers/

repository/

service/

types/

prisma/
```

## Configuração do Ambiente

Clone o repositório:

```bash
git clone <repository-url>
```

Instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente:

```env
DATABASE_URL=
```

Execute as migrations:

```bash
npx prisma migrate dev
```

Inicie a aplicação:

```bash
npm run dev
```

## Roadmap

* [ ] Sistema de autenticação
* [ ] Área do aluno
* [ ] Área administrativa
* [ ] Cadastro de cursos
* [ ] Upload de conteúdo
* [ ] Integração com Kiwify
* [ ] Sistema de matrículas
* [ ] Sistema de notificações por e-mail
* [ ] Dashboard de métricas

## Licença

Este projeto está em desenvolvimento.
