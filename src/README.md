# WhatsApp Flow API

Este projeto implementa uma API para gerenciar fluxos interativos no WhatsApp, como pedidos personalizados de bolo, utilizando a integração com o **WhatsApp Flows** do Facebook.

---

## 📋 Funcionalidades

- **Criação e gerenciamento de fluxos interativos** no WhatsApp.
- **Assinatura de chave pública** para garantir a integridade dos dados.
- **Validação de mensagens recebidas** do Facebook.
- **Descriptografia de cargas úteis** enviadas pelo cliente.
- **Endpoints para upload de chave pública e assinatura de fluxos.**

---

## 🚀 Configuração do Ambiente

### 1. **Pré-requisitos**
- Node.js (v16 ou superior)
- NPM ou Yarn
- Conta no **Gerenciador de Negócios do Facebook**
- Chaves pública e privada para criptografia RSA

### 2. **Instalação**
Clone o repositório e instale as dependências:
```bash
git clone https://github.com/seu-usuario/whatsapp-flow-api.git
cd whatsapp-flow-api
npm install

