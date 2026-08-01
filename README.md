# AgenticVoiceAssistant-AVA
This is AI based Agentic Voice Assistant using Node.js and OpenAI Agents SDK.

## Architecture
- Node.js (TypeScript) agent-based backend
- Dockerized application deployed on AWS EC2
- GitHub Actions used for CI/CD
- Secure environment variable handling

## CI/CD Pipeline
1. Code pushed to `main`
2. GitHub Actions runs CI checks
3. CD workflow SSHs into EC2
4. Docker images rebuilt and restarted using Docker Compose

## Deployment Validation
- `/version` endpoint to verify deployed commit

This project is currently under active development.

Implemented:
- ✅ Planner Agent
- ✅ Tool Calling
- ✅ Guardrails
- ✅ Human-in-the-Loop
- ✅ Runtime Context
- ✅ WebSocket Streaming
- ✅ Text-to-Speech

Upcoming:
- ⏳ UI Improvements
- ⏳ RAG Integration
- ⏳ Authentication
- ⏳ Production Deployment

