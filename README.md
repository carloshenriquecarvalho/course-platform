# Course Platform SaaS LMS

O sistema é um LMS (Learning Management System), desenvolvido com foco em performance, segurança e uma interface limpa. 

Este projeto não é apenas mais um protótipo ou de faculdade. Toda a arquitetura de backend, modelagem de banco de dados relacional e lógica de negócios foi meticulosamente projetada e codificada pelo criador do projeto, suportada por inteligência artificial e intensas pesquisas, resultando em um sistema robusto e pronto para escalar. O frontend, idealizado e iniciado também pelo autor, evoluiu para um padrão de design de alto nível, com interações fluidas, arquitetura limpa e estética moderna.

## O que Torna este Projeto Interessante?

* **Backend Robusto:** Banco de dados modelado de forma inteligente com PostgreSQL e ORM Prisma. A arquitetura segue rigorosamente os padrões de `Services`, `Repositories` e `DTOs` para garantir código limpo, testável e manutenível.
* **Sistema de Cargos Blindado:** Proteção estrita de rotas e ações no core da API. Administradores têm controle total, Instrutores dominam apenas o que criam, e Alunos têm uma experiência imersiva sem esbarrar em áreas restritas.
* **CMS Completo e Dinâmico:** O painel de controle permite criar, editar e organizar Cursos, Módulos e Aulas em uma interface inteligente que lida com dados em tempo real.
* **Design:** UI/UX focada em retenção. Efeitos *glassmorphism*, dark mode nativo, paleta `gold-gradient`, animações fluidas e badges dinâmicos para controle de status.
* **Player Integrado:** A sala de aula virtual já é uma realidade, projetada para entregar o conteúdo educacional com foco e zero distrações.

## Stack

A plataforma utiliza um ecossistema moderno:

* **Frontend:** Next.js 15, React 19, TailwindCSS, Lucide Icons, Shadcn.
* **Backend:** Next.js API Routes Node.js.
* **Banco de Dados:** PostgreSQL hospedado no Supabase.
* **ORM:** Prisma com tipagem forte de ponta a ponta gerada automaticamente.
* **Autenticação:** JWT (com middleware dividido em cada rota) nativo interceptando requisições.
* **Lógica Avançada:** Controle de estado reativo, hooks customizados (`useFetchData`, `useAuth`) e proteção pesada contra race conditions.

## Status Atual:

A lista de tarefas concluídas fala por si só. O que já está rodando perfeitamente:

- [x] Modelagem do banco relacional completo (Usuários, Cursos, Módulos, Aulas, Matrículas, Progresso e Anexos).
- [x] Arquitetura de Backend modular (Controllers nas rotas, Services cuidando da regra de negócio, Repositories lidando com o Prisma).
- [x] Autenticação e Segurança via JWT.
- [x] Dashboard dinâmico baseado no cargo do usuário (Admin vê tudo, Instrutor vê o dele, Aluno vê matriculados).
- [x] CMS Completo (Criação e Edição unificada de Cursos + Módulos + Aulas com validações rigorosas).
- [x] Player de Aulas e Estrutura da Sala do Aluno iniciados.
- [x] Regras estritas de propriedade (Validação de autoria antes de operações destrutivas como DELETE ou PATCH).

### Próximos Passos

O que falta adicionar:

- [ ] Plugar o tracking de conclusão de aulas, "Marcar como assistida" comunicando com a tabela `LessonProgress`.
- [ ] Integração com sistema de armazenamento em nuvem para os vídeos e imagens reais das capas.
- [ ] Conexão de Webhooks do Kiwify para automação de matrículas instantâneas via pagamento aprovado.
- [ ] Sistema automático de envio de E-mails e Redefinição de Senha.

## Como Rodar Localmente

1. **Clone o repositório:**
   ```bash
   git clone <repository-url>
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as chaves da nave:**
   Crie um arquivo `.env` na raiz e adicione as variáveis críticas:
   ```env
   DATABASE_URL="sua url"

   SUPABASE_URL="sua url"
   SUPABASE_SERVICE_ROLE_KEY="sua chave"

   JWT_SECRET_KEY="seu secret key"
   ```

4. **Sincronize o Banco de Dados:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Inicie:**
   ```bash
   npm run dev
   ```

---
*Construído com suor, pesquisa, dedicação e empenho.*
