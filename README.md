# 0G AI Chat - Decentralized AI Conversations

A Next.js application that enables users to chat with AI models on the 0G decentralized network. Built for the 0G hackathon with wallet integration, account funding, and seamless AI interactions.

## 🚀 Features

### Core Functionality
- **Wallet Integration**: Connect with RainbowKit supporting multiple wallet providers
- **Automatic Web Wallet Generation**: Creates a deterministic 0G network wallet from your connected wallet
- **AI Chat Interface**: Chat with powerful AI models (Llama 3.3 70B, DeepSeek R1 70B) on the 0G network
- **Account Funding**: Easy funding system with multiple payment options and transaction history
- **Network Monitoring**: Real-time 0G network status and AI provider information

### Technical Features
- **0G SDK Integration**: Full integration with @0glabs/0g-serving-broker
- **Verifiable AI**: All AI computations verified using Trusted Execution Environments (TeeML)
- **Cost Transparency**: Clear pricing and usage tracking for all AI interactions
- **Responsive Design**: Modern, mobile-first design with professional hackathon aesthetics

## 🏗️ Architecture

### Wallet System
1. **Connected Wallet**: Your main wallet (MetaMask, WalletConnect, etc.) for authentication
2. **Web Wallet**: Auto-generated deterministic wallet for 0G network transactions
3. **Funding Flow**: Send A0GI tokens to web wallet → Automatic account funding → AI chat usage

### AI Integration
- **Model Selection**: Choose between available AI models with different capabilities and costs
- **Message Processing**: Secure, authenticated requests to 0G AI providers
- **Response Verification**: All AI responses verified through 0G's TeeML system
- **Usage Tracking**: Real-time balance updates and transaction history

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Wallet**: RainbowKit, Wagmi, ethers.js
- **AI Network**: 0G Compute Network SDK
- **State Management**: React hooks, TanStack Query

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- A Web3 wallet (MetaMask recommended)
- A0GI test tokens from [0G Faucet](https://faucet.0g.ai)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd 0g-ai-chat
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Add your WalletConnect Project ID:
\`\`\`env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 💰 Funding Your Account

1. **Connect Wallet**: Use RainbowKit to connect your preferred wallet
2. **Get Test Tokens**: Visit the [0G Faucet](https://faucet.0g.ai) to get A0GI tokens
3. **Fund Web Wallet**: Send A0GI tokens to your generated web wallet address
4. **Start Chatting**: Use your funded account to chat with AI models

## 🤖 Available AI Models

### Llama 3.3 70B Instruct
- **Cost**: 0.001 A0GI per request
- **Description**: State-of-the-art 70B parameter model for general AI tasks
- **Verification**: TeeML (Trusted Execution Environment)

### DeepSeek R1 70B
- **Cost**: 0.0015 A0GI per request  
- **Description**: Advanced reasoning model optimized for complex problem solving
- **Verification**: TeeML (Trusted Execution Environment)

## 🏆 Hackathon Criteria Alignment

### Integration & Use of 0G Stack (40%)
- ✅ Full 0G Compute Network SDK integration
- ✅ Native A0GI token usage for payments
- ✅ TeeML verification for all AI computations
- ✅ Real-time network status monitoring
- ✅ Multiple AI model support

### Unique Selling Point (USP) & Roadmap (30%)
- ✅ **USP**: Seamless wallet-to-AI chat experience with automatic web wallet generation
- ✅ **Innovation**: Deterministic wallet creation eliminates manual key management
- ✅ **Roadmap**: Multi-model support, conversation history, advanced funding options

### Functionality and UX (30%)
- ✅ Intuitive wallet connection flow
- ✅ Professional, responsive design
- ✅ Real-time balance and usage tracking
- ✅ Comprehensive funding dashboard
- ✅ Network status transparency

## 🔧 Development

### Project Structure
\`\`\`
├── app/                    # Next.js app directory
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── chat-interface.tsx
│   ├── wallet-header.tsx
│   └── ...
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   └── 0g-client.ts     # 0G SDK integration
└── public/              # Static assets
\`\`\`

### Key Components
- `ChatInterface`: Main AI chat functionality
- `WalletHeader`: Wallet connection and status
- `FundingDashboard`: Account funding and transaction history
- `NetworkStatus`: 0G network monitoring
- `use0GClient`: Custom hook for 0G SDK integration

## 🌐 Network Information

- **Network**: 0G Newton Testnet
- **Chain ID**: 16600
- **RPC URL**: https://evmrpc-testnet.0g.ai
- **Explorer**: https://chainscan-newton.0g.ai
- **Faucet**: https://faucet.0g.ai

## 📝 License

This project is built for the 0G hackathon and is open source under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For questions or support, please open an issue in the repository or reach out during the hackathon.
# zerochat-prototype
