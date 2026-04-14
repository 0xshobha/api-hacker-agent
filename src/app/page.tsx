'use client';

import { useState } from 'react';
import { Tool } from '@/lib/tools';

interface ProviderInfo {
  isSupported: boolean;
  toolName: string;
  message: string;
  actionText: string;
  mailtoLink?: string;
  revenueLoss?: {
    dailyLoss: number;
    monthlyLoss: number;
    yearlyLoss: number;
  };
}

interface ExecutionResult {
  task: string;
  budget: number;
  status: string;
  executionTime: string;
  totalCost: number;
  remainingBudget: number;
  apisUsed: Tool[];
  paymentMethod: string;
}

interface CreditRequest {
  email: string;
  reason: string;
  requestedAmountUsdc: number;
}

interface CreditRedemption {
  code: string;
  walletId: string;
  jwtToken: string;
}

interface X402SignUp {
  walletAddress: string;
  chain: 'polygon' | 'base';
  email: string;
}

interface X402TopUp {
  amount: number;
  walletAddress: string;
  chain: 'polygon' | 'base';
  jwtToken: string;
}

interface X402Claim {
  token: string;
  email: string;
}

interface LogEntry {
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

export default function Home() {
  const [task, setTask] = useState('');
  const [budget, setBudget] = useState(5);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [creditRequest, setCreditRequest] = useState<CreditRequest>({
    email: '',
    reason: '',
    requestedAmountUsdc: 10
  });
  const [creditRedemption, setCreditRedemption] = useState<CreditRedemption>({
    code: '',
    walletId: '',
    jwtToken: ''
  });
  const [isRequestingCredits, setIsRequestingCredits] = useState(false);
  const [isRedeemingCredits, setIsRedeemingCredits] = useState(false);
  const [showX402Modal, setShowX402Modal] = useState(false);
  const [x402SignUp, setX402SignUp] = useState<X402SignUp>({
    walletAddress: '',
    chain: 'base',
    email: ''
  });
  const [x402TopUp, setX402TopUp] = useState<X402TopUp>({
    amount: 10,
    walletAddress: '',
    chain: 'base',
    jwtToken: ''
  });
  const [x402Claim, setX402Claim] = useState<X402Claim>({
    token: '',
    email: ''
  });
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isToppingUp, setIsToppingUp] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [locusApiKey, setLocusApiKey] = useState('');
  const [workspaceBalance, setWorkspaceBalance] = useState<number | null>(null);
  const [showLocusSettings, setShowLocusSettings] = useState(false);
  const [isConnectingLocus, setIsConnectingLocus] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [deployResults, setDeployResults] = useState<unknown[]>([]);
  const [buildApiKey, setBuildApiKey] = useState('');
  const [deployConfig, setDeployConfig] = useState({
    projectName: '',
    projectDescription: '',
    environmentName: 'production',
    environmentType: 'production' as 'development' | 'staging' | 'production',
    serviceName: 'web',
    sourceType: 'github' as 'image' | 'github' | 'git',
    sourceConfig: {
      repo: '',
      branch: 'main',
      buildConfig: {
        method: 'dockerfile',
        dockerfile: 'Dockerfile'
      },
      imageUri: ''
    } as {
      repo?: string;
      branch?: string;
      buildConfig?: {
        method?: string;
        dockerfile?: string;
      };
      imageUri?: string;
    },
    runtimeConfig: {
      cpu: 256,
      memory: 512,
      minInstances: 1,
      maxInstances: 3
    },
    autoDeploy: false,
    region: 'us-east-1'
  });

  // Laso Finance state
  const [showLasoModal, setShowLasoModal] = useState(false);
  const [isLasoLoading, setIsLasoLoading] = useState(false);
  const [lasoWalletAddress, setLasoWalletAddress] = useState('');
  const [lasoOperation, setLasoOperation] = useState<'card' | 'payment' | 'gift-card' | 'push-to-card'>('card');
  const [lasoParams, setLasoParams] = useState({
    amount: 50,
    recipient: '',
    platform: 'venmo' as 'venmo' | 'paypal',
    cardId: '',
    cardNumber: ''
  });
  const [giftCards, setGiftCards] = useState<{id: string; name: string}[]>([]);

  // Parse log messages and determine their type
  const parseLogType = (message: string): LogEntry['type'] => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('error') || lowerMessage.includes('failed') || lowerMessage.includes('insufficient')) {
      return 'error';
    } else if (lowerMessage.includes('success') || lowerMessage.includes('completed') || lowerMessage.includes('successful')) {
      return 'success';
    } else if (lowerMessage.includes('warning') || lowerMessage.includes('losing') || lowerMessage.includes('revenue')) {
      return 'warning';
    } else {
      return 'info';
    }
  };

  // Convert string logs to LogEntry format
  const convertToLogEntries = (messages: string[]): LogEntry[] => {
    return messages.map(message => ({
      message,
      type: parseLogType(message)
    }));
  };

  // Helper to add logs with automatic limiting (max 50 entries)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addLogs = (newMessages: string[]) => {
    setLogs(prevLogs => {
      const newEntries = convertToLogEntries(newMessages);
      const combined = [...prevLogs, ...newEntries];
      return combined.slice(-50); // Keep only last 50 logs
    });
  };

  const handleReset = () => {
    setTask('');
    setBudget(5);
    setLogs([]);
    setProviderInfo(null);
    setExecutionResult(null);
  };

  const handlePresetTask = (presetTask: string, presetBudget: number) => {
    setTask(presetTask);
    setBudget(presetBudget);
    setLogs([]);
    setProviderInfo(null);
    setExecutionResult(null);
  };

  const handleCreditRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRequestingCredits(true);

    try {
      const response = await fetch('/api/request-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(creditRequest),
      });

      const result = await response.json();

      if (result.success) {
        setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
          `Credit request submitted successfully!`,
          `Request ID: ${result.data.id}`,
          `Amount: $${creditRequest.requestedAmountUsdc} USDC`,
          `Email: ${creditRequest.email}`,
          'The Locus team will review your request shortly.',
          'You will receive a redemption code via email when approved.'
        ])]);
        setShowCreditModal(false);
        setCreditRequest({ email: '', reason: '', requestedAmountUsdc: 10 });
      } else {
        setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
          `Credit request failed: ${result.error}`
        ])]);
      }
    } catch (error) {
      console.error('Credit request error:', error);
      setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
        'Error: Failed to submit credit request'
      ])]);
    } finally {
      setIsRequestingCredits(false);
    }
  };

  const handleCreditRedemption = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRedeemingCredits(true);

    try {
      const response = await fetch('/api/redeem-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(creditRedemption),
      });

      const result = await response.json();

      if (result.success) {
        setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
          'Credits successfully redeemed!',
          'USDC has been added to your wallet.',
          'You can now use these credits for API calls.'
        ])]);
        setCreditRedemption({ code: '', walletId: '', jwtToken: '' });
      } else {
        setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
          `Credit redemption failed: ${result.error}`
        ])]);
      }
    } catch (error) {
      console.error('Credit redemption error:', error);
      setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
        'Error: Failed to redeem credits'
      ])]);
    } finally {
      setIsRedeemingCredits(false);
    }
  };

  const handleX402SignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningUp(true);

    try {
      const response = await fetch('/api/x402-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(x402SignUp),
      });

      const result = await response.json();

      if (result.success) {
        setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
          'Successfully signed up with x402!',
          `Workspace ID: ${result.data.workspaceId}`,
          `Initial credits: $${result.data.initialCredits} USDC`,
          `Account type: ${result.data.accountType}`,
          result.data.claimUrl ? `Claim URL: ${result.data.claimUrl}` : 'Check your email for login instructions.',
          'You can now use this workspace for API calls.'
        ])]);
        setX402SignUp({ walletAddress: '', chain: 'base', email: '' });
      } else if (result.paymentRequired) {
        setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
          'Payment required for x402 sign-up',
          `Amount: $${result.paymentDetails['Payment-Amount']} USDC`,
          `Chain: ${result.paymentDetails['Payment-Chain']}`,
          `Address: ${result.paymentDetails['Payment-Address']}`,
          'Please complete the payment and retry.',
          'Payment will be processed via x402 protocol.'
        ])]);
      } else {
        setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
          `x402 sign-up failed: ${result.error}`
        ])]);
      }
    } catch (error) {
      console.error('x402 sign-up error:', error);
      setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
        'Error: Failed to sign up with x402'
      ])]);
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleX402TopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsToppingUp(true);

    try {
      const response = await fetch('/api/x402-topup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(x402TopUp),
      });

      const result = await response.json();

      if (result.success) {
        setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
          'Successfully topped up credits!',
          `Amount added: $${result.data.amountAdded} USDC`,
          `New balance: $${result.data.creditBalance} USDC`,
          `Workspace ID: ${result.data.workspaceId}`,
          'Credits are now available for API calls.'
        ])]);
        setX402TopUp({ amount: 10, walletAddress: '', chain: 'base', jwtToken: '' });
      } else if (result.paymentRequired) {
        setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
          'Payment required for x402 top-up',
          `Amount: $${result.paymentDetails['Payment-Amount']} USDC`,
          `Chain: ${result.paymentDetails['Payment-Chain']}`,
          `Address: ${result.paymentDetails['Payment-Address']}`,
          'Please complete the payment and retry.',
          'Payment will be processed via x402 protocol.'
        ])]);
      } else {
        setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
          `x402 top-up failed: ${result.error}`
        ])]);
      }
    } catch (error) {
      console.error('x402 top-up error:', error);
      setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
        'Error: Failed to top up credits with x402'
      ])]);
    } finally {
      setIsToppingUp(false);
    }
  };

  const handleX402Claim = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsClaiming(true);

    try {
      const response = await fetch('/api/x402-claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(x402Claim),
      });

      const result = await response.json();

      if (result.success) {
        setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
          'Claim token successfully redeemed!',
          `Email: ${result.data.email}`,
          `Workspace ID: ${result.data.workspaceId}`,
          `Login URL: ${result.data.loginUrl}`,
          'Check your email for login instructions.'
        ])]);
        setX402Claim({ token: '', email: '' });
      } else {
        setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
          `Claim redemption failed: ${result.error}`
        ])]);
      }
    } catch (error) {
      console.error('Claim redemption error:', error);
      setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
        'Error: Failed to redeem claim token'
      ])]);
    } finally {
      setIsClaiming(false);
    }
  };

  const handleConnectLocus = async () => {
    if (!locusApiKey.trim()) {
      setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
        'Error: Please enter your Locus API key'
      ])]);
      return;
    }

    setIsConnectingLocus(true);

    try {
      // Test the API key by checking balance
      const response = await fetch('https://api.paywithlocus.com/api/pay/balance', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${locusApiKey}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWorkspaceBalance(parseFloat(data.data.balance));
        setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
          'Successfully connected to Locus workspace!',
          `Workspace Balance: $${data.data.balance} ${data.data.token}`,
          `Wallet Address: ${data.data.wallet_address}`,
          'You can now use real MPP endpoints with your credits.'
        ])]);
        setShowLocusSettings(false);
      } else {
        const errorData = await response.text();
        setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
          'Failed to connect to Locus: Invalid API key',
          `Error: ${errorData}`,
          'Please check your API key and try again.'
        ])]);
        setWorkspaceBalance(null);
      }
    } catch (error) {
      console.error('Locus connection error:', error);
      setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
        'Error: Failed to connect to Locus API'
      ])]);
      setWorkspaceBalance(null);
    } finally {
      setIsConnectingLocus(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRealExecution = async (selectedTools: Tool[], totalCost: number) => {
    if (!locusApiKey || !workspaceBalance) {
      setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
        'Error: Please connect your Locus workspace first',
        'Click "Connect Locus" to add your API key.'
      ])]);
      return false;
    }

    if (totalCost > workspaceBalance) {
      setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
        `Error: Insufficient credits`,
        `Required: $${totalCost.toFixed(3)}, Available: $${workspaceBalance.toFixed(3)}`,
        'Please add more credits to your Locus workspace.'
      ])]);
      return false;
    }

    return true;
  };

  const handleDeployWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeploying(true);
    setDeployResults([]);

    try {
      setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
        'Starting Build with Locus deployment workflow...',
        `Project: ${deployConfig.projectName}`,
        `Service: ${deployConfig.serviceName}`,
        `Source: ${deployConfig.sourceType}`
      ])]);

      const response = await fetch('/api/locus-deploy-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: buildApiKey,
          projectName: deployConfig.projectName,
          projectDescription: deployConfig.projectDescription,
          environmentName: deployConfig.environmentName,
          environmentType: deployConfig.environmentType,
          serviceName: deployConfig.serviceName,
          sourceType: deployConfig.sourceType,
          sourceConfig: deployConfig.sourceConfig,
          runtimeConfig: deployConfig.runtimeConfig,
          autoDeploy: deployConfig.autoDeploy,
          region: deployConfig.region
        }),
      });

      const result = await response.json();

      if (result.success) {
        setDeployResults(result.results);

        // Log each step
        result.results.forEach((step: {step: number; action: string; status: string; projectId?: string; environmentId?: string; serviceId?: string; deploymentId?: string; serviceUrl?: string; estimatedTime?: string; error?: string}) => {
          if (step.status === 'completed') {
            const stepLogs = [
              `Step ${step.step}: ${step.action}`,
              ...(step.projectId ? [`Project ID: ${step.projectId}`] : []),
              ...(step.environmentId ? [`Environment ID: ${step.environmentId}`] : []),
              ...(step.serviceId ? [`Service ID: ${step.serviceId}`] : []),
              ...(step.deploymentId ? [`Deployment ID: ${step.deploymentId}`] : []),
              ...(step.serviceUrl ? [`Service URL: ${step.serviceUrl}`] : []),
              ...(step.estimatedTime ? [`Estimated time: ${step.estimatedTime}`] : [])
            ];
            setLogs(prevLogs => [...prevLogs, ...convertToLogEntries(stepLogs)]);
          } else if (step.status === 'failed') {
            setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
              `Step ${step.step} failed: ${step.error}`
            ])]);
          } else {
            setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
              `Step ${step.step}: ${step.action}`
            ])]);
          }
        });

        setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
          'Deployment workflow completed!',
          `Next: ${result.summary.nextSteps.join(', ')}`
        ])]);

        setShowDeployModal(false);
      } else {
        setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
          'Deployment workflow failed',
          result.error || 'Unknown error'
        ])]);
      }
    } catch (error) {
      console.error('Deploy workflow error:', error);
      setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
        'Error: Failed to execute deployment workflow'
      ])]);
    } finally {
      setIsDeploying(false);
    }
  };

  // Laso Finance handlers
  const handleLasoOperation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLasoLoading(true);

    try {
      setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
        `Starting Laso Finance operation: ${lasoOperation}`,
        `Amount: $${lasoParams.amount} USDC`,
        ...(lasoWalletAddress && [`Wallet: ${lasoWalletAddress}`])
      ])]);

      const endpoint = '/api/laso';
      const body: Record<string, unknown> = {
        action: lasoOperation,
        walletAddress: lasoWalletAddress,
        amount: lasoParams.amount
      };

      // Add operation-specific params
      if (lasoOperation === 'payment') {
        body.recipient = lasoParams.recipient;
        body.platform = lasoParams.platform;
      } else if (lasoOperation === 'gift-card') {
        body.cardId = lasoParams.cardId;
      } else if (lasoOperation === 'push-to-card') {
        body.cardNumber = lasoParams.cardNumber;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const result = await response.json();

      if (result.success) {
        setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
          'Laso Finance operation successful!',
          `Operation: ${lasoOperation}`,
          `Amount: $${lasoParams.amount} USDC`,
          ...(result.data?.cardId && [`Card ID: ${result.data.cardId}`]),
          ...(result.data?.transactionId && [`Transaction: ${result.data.transactionId}`]),
          ...(result.data?.status && [`Status: ${result.data.status}`])
        ])]);
      } else if (result.paymentRequired) {
        setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
          'Payment required via x402 protocol',
          `Amount: $${result.paymentDetails['Payment-Amount']} USDC`,
          `Chain: ${result.paymentDetails['Payment-Chain']}`,
          `Address: ${result.paymentDetails['Payment-Address']}`,
          'Please complete the payment and retry'
        ])]);
      } else {
        setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
          `Laso operation failed: ${result.error}`
        ])]);
      }
    } catch (error) {
      console.error('Laso error:', error);
      setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
        'Error: Laso Finance operation failed'
      ])]);
    } finally {
      setIsLasoLoading(false);
    }
  };

  const searchGiftCards = async () => {
    setIsLasoLoading(true);
    try {
      const response = await fetch('/api/laso?action=search-gift-cards');
      const result = await response.json();

      if (result.success) {
        setGiftCards(result.data?.cards || []);
        setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
          `Found ${result.data?.cards?.length || 0} gift cards available`
        ])]);
      } else {
        setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
          'Failed to search gift cards'
        ])]);
      }
    } catch {
      setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
        'Error: Failed to search gift cards'
      ])]);
    } finally {
      setIsLasoLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim() && !isLoading) {
      setIsLoading(true);
      setLogs(convertToLogEntries([`Task submitted: ${task}`, `Budget set: $${budget}`, 'Initializing agent...']));

      try {
        // Use real agent execution if Locus is connected
        if (locusApiKey && workspaceBalance) {
          setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
            'Using Locus workspace for real execution',
            `Available balance: $${workspaceBalance.toFixed(2)}`
          ])]);

          const response = await fetch('/api/run-real-agent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task, budget, locusApiKey }),
          });

          const result = await response.json();

          if (result.success) {
            const newLogs = [
              `Real execution completed!`,
              `Tools used: ${result.data.toolsUsed.map((t: {name: string}) => t.name).join(', ')}`,
              `Actual cost: $${result.data.actualCost.toFixed(3)}`,
              `Remaining balance: $${result.data.remainingBudget.toFixed(3)}`,
              `Status: ${result.data.status}`
            ];

            setLogs(prevLogs => [
              ...prevLogs,
              ...convertToLogEntries(newLogs),
            ]);

            result.data.executionResults.forEach((execution: {tool: string; success: boolean; result?: unknown; error?: string; cost: number}) => {
              if (execution.success) {
                setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
                  `Success: ${execution.tool} - $${execution.cost.toFixed(3)}`
                ])]);
              } else {
                setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
                  `Failed: ${execution.tool} - ${execution.error}`
                ])]);
              }
            });

            setExecutionResult({
              task: result.data.task,
              budget: result.data.budget,
              status: result.data.status,
              executionTime: 'Real-time',
              totalCost: result.data.actualCost,
              remainingBudget: result.data.remainingBudget,
              apisUsed: result.data.toolsUsed,
              paymentMethod: 'Locus Workspace'
            });

            // Update workspace balance
            setWorkspaceBalance(result.data.remainingBudget);
          } else {
            setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([`Error: ${result.error}`])]);
          }
        } else {
          // Fallback to mock execution
          const response = await fetch('/api/run-agent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task, budget }),
          });

          const result = await response.json();

          const newLogs = [
            ...result.data.logs,
            `Execution completed in ${result.data.executionTime}`,
            `Total cost: $${result.data.totalCost}`,
            `Status: ${result.data.status}`,
            'Note: Using mock execution. Connect Locus for real API calls.'
          ];

          if (result.success) {
            setLogs(prevLogs => [
              ...prevLogs,
              ...convertToLogEntries(newLogs),
            ]);
            setProviderInfo(result.data.providerInfo);
            setExecutionResult({
              task: result.data.task,
              budget: result.data.budget,
              status: result.data.status,
              executionTime: result.data.executionTime,
              totalCost: result.data.totalCost,
              remainingBudget: result.data.remainingBudget,
              apisUsed: result.data.apisUsed,
              paymentMethod: result.data.paymentMethod
            });
          } else {
            setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([`Error: ${result.error}`])]);
          }
        }
      } catch (error) {
        console.error('API Error:', error);
        setLogs(prevLogs => [...prevLogs, ...convertToLogEntries(['Error: Failed to connect to agent API'])]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">API Hacker Agent</h1>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                AI-Powered Task Execution
              </h2>
              <p className="text-gray-600">
                Let our agent find the best APIs and complete your tasks within budget
              </p>
            </div>

            {/* Preset Tasks */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Start Tasks</h3>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => handlePresetTask('Scrape leads from tech company websites', 3)}
                  disabled={isLoading}
                  className="text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="font-medium text-gray-900">Scrape Leads</div>
                  <div className="text-sm text-gray-600">Extract contact info from tech company websites - $3 budget</div>
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetTask('Generate marketing content for a SaaS product', 5)}
                  disabled={isLoading}
                  className="text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="font-medium text-gray-900">Generate Content</div>
                  <div className="text-sm text-gray-600">Create marketing copy for SaaS product - $5 budget</div>
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetTask('Search for latest AI and machine learning trends', 2)}
                  disabled={isLoading}
                  className="text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="font-medium text-gray-900">Search Data</div>
                  <div className="text-sm text-gray-600">Research AI/ML trends and insights - $2 budget</div>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Enter your task..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">
                    Budget: ${budget}
                  </label>
                  <span className="text-xs text-gray-500">$1 - $10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Executing...
                  </>
                ) : (
                  'Execute Task'
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={isLoading}
                className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Reset
              </button>

              <button
                type="button"
                onClick={() => setShowCreditModal(true)}
                disabled={isLoading}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:bg-purple-400 disabled:cursor-not-allowed"
              >
                Get Free Credits
              </button>

              <button
                type="button"
                onClick={() => setShowX402Modal(true)}
                disabled={isLoading}
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:bg-orange-400 disabled:cursor-not-allowed"
              >
                x402 Payment Protocol
              </button>

              <button
                type="button"
                onClick={() => setShowLocusSettings(true)}
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {workspaceBalance ? `Connected: $${workspaceBalance.toFixed(2)}` : 'Connect Locus'}
              </button>

              <button
                type="button"
                onClick={() => setShowDeployModal(true)}
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-green-400 disabled:cursor-not-allowed"
              >
                Build with Locus
              </button>

              <button
                type="button"
                onClick={() => setShowLasoModal(true)}
                disabled={isLoading}
                className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg hover:bg-pink-700 transition-colors font-medium disabled:bg-pink-400 disabled:cursor-not-allowed"
              >
                Laso Finance 💳
              </button>
            </form>

            {logs.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Execution Logs</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 max-h-40 overflow-y-auto">
                  {logs.map((log, index) => (
                    <div key={index} className={`text-sm font-mono flex items-start gap-2 ${
                      log.type === 'error' ? 'text-red-600' :
                      log.type === 'success' ? 'text-green-600' :
                      log.type === 'warning' ? 'text-yellow-600' :
                      'text-gray-600'
                    }`}>, , ,m
                      <span className="flex-shrink-0 mt-0.5">
                        {log.type === 'error' && '❌'}
                        {log.type === 'success' && '✅'}
                        {log.type === 'warning' && '⚠️'}
                        {log.type === 'info' && 'ℹ️'}
                      </span>
                      <span className="flex-1">{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {providerInfo && !providerInfo.isSupported && (
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-lg font-semibold text-yellow-800 mb-1">
                      Provider Integration Opportunity
                    </h4>
                    <p className="text-sm text-yellow-700">
                      {providerInfo.message}
                    </p>
                  </div>

                  {providerInfo.revenueLoss && (
                    <div className="bg-yellow-100 rounded p-3">
                      <p className="text-sm font-medium text-yellow-800 mb-1">
                        Estimated Revenue Loss:
                      </p>
                      <div className="text-xs text-yellow-700 space-y-1">
                        <p> Daily: ${providerInfo.revenueLoss.dailyLoss.toFixed(2)}</p>
                        <p> Monthly: ${providerInfo.revenueLoss.monthlyLoss.toFixed(2)}</p>
                        <p> Yearly: ${providerInfo.revenueLoss.yearlyLoss.toFixed(2)}</p>
                      </div>
                    </div>
                  )}

                  <a
                    href={providerInfo.mailtoLink}
                    className="inline-flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {providerInfo.actionText}
                  </a>
                </div>
              </div>
            )}

            {providerInfo && providerInfo.isSupported && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-lg font-semibold text-green-800">
                      Optimal Choice
                    </h4>
                    <p className="text-sm text-green-700">
                      {providerInfo.message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {executionResult && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-blue-800 mb-4">
                  Execution Summary
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Task:</span>
                      <span className="text-sm text-gray-900">{executionResult.task}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Status:</span>
                      <span className="text-sm text-green-600 font-medium">{executionResult.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Execution Time:</span>
                      <span className="text-sm text-gray-900">{executionResult.executionTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Payment Method:</span>
                      <span className="text-sm text-gray-900">{executionResult.paymentMethod}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Budget:</span>
                      <span className="text-sm text-gray-900">${executionResult.budget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Total Cost:</span>
                      <span className="text-sm text-blue-600 font-medium">${executionResult.totalCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Remaining:</span>
                      <span className="text-sm text-green-600 font-medium">${executionResult.remainingBudget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">APIs Used:</span>
                      <span className="text-sm text-gray-900">{executionResult.apisUsed.length}</span>
                    </div>
                  </div>
                </div>
                {executionResult.apisUsed.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <p className="text-sm font-medium text-gray-600 mb-2">APIs Used:</p>
                    <div className="flex flex-wrap gap-2">
                      {executionResult.apisUsed.map((api, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {api.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Credit Modal */}
      {showCreditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Locus Credits</h3>
                <button
                  onClick={() => setShowCreditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Request Credits Form */}
              <div className="mb-8">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Request Free Credits</h4>
                <form onSubmit={handleCreditRequest} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={creditRequest.email}
                      onChange={(e) => setCreditRequest({...creditRequest, email: e.target.value})}
                      placeholder="you@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                      Amount (USDC)
                    </label>
                    <select
                      id="amount"
                      value={creditRequest.requestedAmountUsdc}
                      onChange={(e) => setCreditRequest({...creditRequest, requestedAmountUsdc: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={5}>$5 (Quick test)</option>
                      <option value={10}>$10 (Hackathon)</option>
                      <option value={25}>$25 (Integration)</option>
                      <option value={50}>$50 (Extended)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                      Reason (min 10 characters)
                    </label>
                    <textarea
                      id="reason"
                      value={creditRequest.reason}
                      onChange={(e) => setCreditRequest({...creditRequest, reason: e.target.value})}
                      placeholder="Describe what you're building or why you need credits..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                      required
                      minLength={10}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isRequestingCredits}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    {isRequestingCredits ? 'Requesting...' : 'Request Credits'}
                  </button>
                </form>
              </div>

              {/* Redemption Form */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Redeem Credits</h4>
                <form onSubmit={handleCreditRedemption} className="space-y-4">
                  <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                      Redemption Code
                    </label>
                    <input
                      type="text"
                      id="code"
                      value={creditRedemption.code}
                      onChange={(e) => setCreditRedemption({...creditRedemption, code: e.target.value})}
                      placeholder="XXX-XXX-XXX-XXX"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      pattern="[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="walletId" className="block text-sm font-medium text-gray-700 mb-1">
                      Wallet ID
                    </label>
                    <input
                      type="text"
                      id="walletId"
                      value={creditRedemption.walletId}
                      onChange={(e) => setCreditRedemption({...creditRedemption, walletId: e.target.value})}
                      placeholder="Your Locus wallet ID"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="jwtToken" className="block text-sm font-medium text-gray-700 mb-1">
                      JWT Token
                    </label>
                    <input
                      type="password"
                      id="jwtToken"
                      value={creditRedemption.jwtToken}
                      onChange={(e) => setCreditRedemption({...creditRedemption, jwtToken: e.target.value})}
                      placeholder="Your Locus JWT token"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isRedeemingCredits}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-green-400 disabled:cursor-not-allowed"
                  >
                    {isRedeemingCredits ? 'Redeeming...' : 'Redeem Credits'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* x402 Modal */}
      {showX402Modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">x402 Payment Protocol</h3>
                <button
                  onClick={() => setShowX402Modal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* x402 Sign Up */}
              <div className="mb-8">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Sign Up with x402</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Create a new workspace using USDC on Polygon or Base. Get $6.00 initial credits.
                </p>
                <form onSubmit={handleX402SignUp} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="x402-wallet" className="block text-sm font-medium text-gray-700 mb-1">
                        Wallet Address
                      </label>
                      <input
                        type="text"
                        id="x402-wallet"
                        value={x402SignUp.walletAddress}
                        onChange={(e) => setX402SignUp({...x402SignUp, walletAddress: e.target.value})}
                        placeholder="0x..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        pattern="^0x[a-fA-F0-9]{40}$"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="x402-chain" className="block text-sm font-medium text-gray-700 mb-1">
                        Blockchain
                      </label>
                      <select
                        id="x402-chain"
                        value={x402SignUp.chain}
                        onChange={(e) => setX402SignUp({...x402SignUp, chain: e.target.value as 'polygon' | 'base'})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="base">Base (USDC)</option>
                        <option value="polygon">Polygon (USDC)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="x402-email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email (optional)
                    </label>
                    <input
                      type="email"
                      id="x402-email"
                      value={x402SignUp.email}
                      onChange={(e) => setX402SignUp({...x402SignUp, email: e.target.value})}
                      placeholder="you@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSigningUp}
                    className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:bg-orange-400 disabled:cursor-not-allowed"
                  >
                    {isSigningUp ? 'Signing Up...' : 'Sign Up with x402'}
                  </button>
                </form>
              </div>

              {/* x402 Top Up */}
              <div className="mb-8 border-t pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Top Up Credits</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Add more credits to your existing workspace using x402 protocol.
                </p>
                <form onSubmit={handleX402TopUp} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="x402-topup-amount" className="block text-sm font-medium text-gray-700 mb-1">
                        Amount (USDC)
                      </label>
                      <select
                        id="x402-topup-amount"
                        value={x402TopUp.amount}
                        onChange={(e) => setX402TopUp({...x402TopUp, amount: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value={1}>$1.00</option>
                        <option value={5}>$5.00</option>
                        <option value={10}>$10.00</option>
                        <option value={25}>$25.00</option>
                        <option value={50}>$50.00</option>
                        <option value={100}>$100.00</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="x402-topup-chain" className="block text-sm font-medium text-gray-700 mb-1">
                        Blockchain
                      </label>
                      <select
                        id="x402-topup-chain"
                        value={x402TopUp.chain}
                        onChange={(e) => setX402TopUp({...x402TopUp, chain: e.target.value as 'polygon' | 'base'})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="base">Base (USDC)</option>
                        <option value="polygon">Polygon (USDC)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="x402-topup-wallet" className="block text-sm font-medium text-gray-700 mb-1">
                      Wallet Address
                    </label>
                    <input
                      type="text"
                      id="x402-topup-wallet"
                      value={x402TopUp.walletAddress}
                      onChange={(e) => setX402TopUp({...x402TopUp, walletAddress: e.target.value})}
                      placeholder="0x..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      pattern="^0x[a-fA-F0-9]{40}$"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="x402-topup-jwt" className="block text-sm font-medium text-gray-700 mb-1">
                      JWT Token
                    </label>
                    <input
                      type="password"
                      id="x402-topup-jwt"
                      value={x402TopUp.jwtToken}
                      onChange={(e) => setX402TopUp({...x402TopUp, jwtToken: e.target.value})}
                      placeholder="Your Locus JWT token"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isToppingUp}
                    className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:bg-orange-400 disabled:cursor-not-allowed"
                  >
                    {isToppingUp ? 'Topping Up...' : 'Top Up Credits'}
                  </button>
                </form>
              </div>

              {/* Claim Redemption */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Redeem Claim Token</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Redeem a claim token to link your email to your workspace.
                </p>
                <form onSubmit={handleX402Claim} className="space-y-4">
                  <div>
                    <label htmlFor="x402-claim-token" className="block text-sm font-medium text-gray-700 mb-1">
                      Claim Token
                    </label>
                    <input
                      type="text"
                      id="x402-claim-token"
                      value={x402Claim.token}
                      onChange={(e) => setX402Claim({...x402Claim, token: e.target.value})}
                      placeholder="claim_token_here"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="x402-claim-email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="x402-claim-email"
                      value={x402Claim.email}
                      onChange={(e) => setX402Claim({...x402Claim, email: e.target.value})}
                      placeholder="you@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isClaiming}
                    className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:bg-orange-400 disabled:cursor-not-allowed"
                  >
                    {isClaiming ? 'Redeeming...' : 'Redeem Claim Token'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Locus Settings Modal */}
      {showLocusSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Locus Workspace</h3>
                <button
                  onClick={() => setShowLocusSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {workspaceBalance ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-green-800 mb-2">Connected to Locus</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Balance:</span>
                        <span className="text-sm font-medium text-green-600">${workspaceBalance.toFixed(2)} USDC</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <span className="text-sm font-medium text-green-600">Active</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">What you can do:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>Execute real tasks with 89 MPP endpoints</li>
                      <li>Pay per use with your workspace credits</li>
                      <li>Track actual costs and remaining balance</li>
                      <li>Use production APIs with no separate accounts</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      setLocusApiKey('');
                      setWorkspaceBalance(null);
                      setShowLocusSettings(false);
                      setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([
                        'Disconnected from Locus workspace'
                      ])]);
                    }}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="locus-api-key" className="block text-sm font-medium text-gray-700 mb-1">
                      Locus API Key
                    </label>
                    <input
                      type="password"
                      id="locus-api-key"
                      value={locusApiKey}
                      onChange={(e) => setLocusApiKey(e.target.value)}
                      placeholder="claw_dev_..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Get your API key from app.paywithlocus.com
                    </p>
                  </div>
                  <button
                    onClick={handleConnectLocus}
                    disabled={isConnectingLocus || !locusApiKey.trim()}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:bg-indigo-400 disabled:cursor-not-allowed"
                  >
                    {isConnectingLocus ? 'Connecting...' : 'Connect Workspace'}
                  </button>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-800 mb-2">Your Workspace Info:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>Email: anandcollege07@gmail.com</li>
                      <li>Balance: $1.00 USDC</li>
                      <li>Status: Active</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Build with Locus Deployment Modal */}
      {showDeployModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Build with Locus</h3>
                <button
                  onClick={() => setShowDeployModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleDeployWorkflow} className="space-y-6">
                {/* API Key */}
                <div>
                  <label htmlFor="build-api-key" className="block text-sm font-medium text-gray-700 mb-1">
                    Build with Locus API Key
                  </label>
                  <input
                    type="password"
                    id="build-api-key"
                    value={buildApiKey}
                    onChange={(e) => setBuildApiKey(e.target.value)}
                    placeholder="claw_dev_..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Get your API key from app.paywithlocus.com
                  </p>
                </div>

                {/* Project Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Project Name
                    </label>
                    <input
                      type="text"
                      id="project-name"
                      value={deployConfig.projectName}
                      onChange={(e) => setDeployConfig({...deployConfig, projectName: e.target.value})}
                      placeholder="my-app"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="project-description" className="block text-sm font-medium text-gray-700 mb-1">
                      Project Description
                    </label>
                    <input
                      type="text"
                      id="project-description"
                      value={deployConfig.projectDescription}
                      onChange={(e) => setDeployConfig({...deployConfig, projectDescription: e.target.value})}
                      placeholder="My application"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Environment Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="environment-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Environment Name
                    </label>
                    <input
                      type="text"
                      id="environment-name"
                      value={deployConfig.environmentName}
                      onChange={(e) => setDeployConfig({...deployConfig, environmentName: e.target.value})}
                      placeholder="production"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="environment-type" className="block text-sm font-medium text-gray-700 mb-1">
                      Environment Type
                    </label>
                    <select
                      id="environment-type"
                      value={deployConfig.environmentType}
                      onChange={(e) => setDeployConfig({...deployConfig, environmentType: e.target.value as 'development' | 'staging' | 'production'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="development">Development</option>
                      <option value="staging">Staging</option>
                      <option value="production">Production</option>
                    </select>
                  </div>
                </div>

                {/* Service Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="service-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Service Name
                    </label>
                    <input
                      type="text"
                      id="service-name"
                      value={deployConfig.serviceName}
                      onChange={(e) => setDeployConfig({...deployConfig, serviceName: e.target.value})}
                      placeholder="web"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="source-type" className="block text-sm font-medium text-gray-700 mb-1">
                      Source Type
                    </label>
                    <select
                      id="source-type"
                      value={deployConfig.sourceType}
                      onChange={(e) => setDeployConfig({...deployConfig, sourceType: e.target.value as 'image' | 'github' | 'git'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="image">Pre-built Image</option>
                      <option value="github">GitHub Repository</option>
                      <option value="git">Git Repository</option>
                    </select>
                  </div>
                </div>

                {/* Source Configuration */}
                {deployConfig.sourceType === 'image' && (
                  <div>
                    <label htmlFor="image-uri" className="block text-sm font-medium text-gray-700 mb-1">
                      Image URI
                    </label>
                    <input
                      type="text"
                      id="image-uri"
                      value={deployConfig.sourceConfig.imageUri || ''}
                      onChange={(e) => setDeployConfig({
                        ...deployConfig,
                        sourceConfig: {...deployConfig.sourceConfig, imageUri: e.target.value}
                      })}
                      placeholder="registry.example.com/my-repo:latest"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                )}

                {deployConfig.sourceType === 'github' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="github-repo" className="block text-sm font-medium text-gray-700 mb-1">
                          GitHub Repository
                        </label>
                        <input
                          type="text"
                          id="github-repo"
                          value={deployConfig.sourceConfig.repo}
                          onChange={(e) => setDeployConfig({
                            ...deployConfig,
                            sourceConfig: {...deployConfig.sourceConfig, repo: e.target.value}
                          })}
                          placeholder="my-org/my-repo"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="github-branch" className="block text-sm font-medium text-gray-700 mb-1">
                          Branch
                        </label>
                        <input
                          type="text"
                          id="github-branch"
                          value={deployConfig.sourceConfig.branch}
                          onChange={(e) => setDeployConfig({
                            ...deployConfig,
                            sourceConfig: {...deployConfig.sourceConfig, branch: e.target.value}
                          })}
                          placeholder="main"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Runtime Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="cpu" className="block text-sm font-medium text-gray-700 mb-1">
                      CPU (mCPU)
                    </label>
                    <input
                      type="number"
                      id="cpu"
                      value={deployConfig.runtimeConfig.cpu}
                      onChange={(e) => setDeployConfig({
                        ...deployConfig,
                        runtimeConfig: {...deployConfig.runtimeConfig, cpu: Number(e.target.value)}
                      })}
                      min="256"
                      max="4096"
                      step="256"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="memory" className="block text-sm font-medium text-gray-700 mb-1">
                      Memory (MB)
                    </label>
                    <input
                      type="number"
                      id="memory"
                      value={deployConfig.runtimeConfig.memory}
                      onChange={(e) => setDeployConfig({
                        ...deployConfig,
                        runtimeConfig: {...deployConfig.runtimeConfig, memory: Number(e.target.value)}
                      })}
                      min="512"
                      max="16384"
                      step="512"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                      Region
                    </label>
                    <select
                      id="region"
                      value={deployConfig.region}
                      onChange={(e) => setDeployConfig({...deployConfig, region: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="us-east-1">US East (N. Virginia)</option>
                      <option value="sa-east-1">South America (São Paulo)</option>
                    </select>
                  </div>
                </div>

                {/* Auto Deploy */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="auto-deploy"
                    checked={deployConfig.autoDeploy}
                    onChange={(e) => setDeployConfig({...deployConfig, autoDeploy: e.target.checked})}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="auto-deploy" className="ml-2 text-sm text-gray-700">
                    Auto-deploy on code changes
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isDeploying}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-green-400 disabled:cursor-not-allowed"
                >
                  {isDeploying ? 'Deploying...' : 'Deploy Service'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Laso Finance Modal */}
      {showLasoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Laso Finance 💳</h3>
                <button
                  onClick={() => setShowLasoModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium text-pink-800 mb-2">Agent Payment Powers</h4>
                <ul className="text-sm text-pink-700 space-y-1">
                  <li>💳 Order prepaid cards ($5-$1000)</li>
                  <li>💸 Send Venmo/PayPal payments</li>
                  <li>🎁 Purchase gift cards ($5-$9000)</li>
                  <li>💵 Push to U.S. debit cards</li>
                  <li>🔐 Powered by x402 protocol</li>
                </ul>
              </div>

              <form onSubmit={handleLasoOperation} className="space-y-4">
                {/* Wallet Address */}
                <div>
                  <label htmlFor="laso-wallet" className="block text-sm font-medium text-gray-700 mb-1">
                    Wallet Address (Optional)
                  </label>
                  <input
                    type="text"
                    id="laso-wallet"
                    value={lasoWalletAddress}
                    onChange={(e) => setLasoWalletAddress(e.target.value)}
                    placeholder="0x... (for x402 payment)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                {/* Operation Type */}
                <div>
                  <label htmlFor="laso-operation" className="block text-sm font-medium text-gray-700 mb-1">
                    Operation
                  </label>
                  <select
                    id="laso-operation"
                    value={lasoOperation}
                    onChange={(e) => setLasoOperation(e.target.value as 'card' | 'payment' | 'gift-card' | 'push-to-card')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="card">Order Prepaid Card</option>
                    <option value="payment">Send Payment (Venmo/PayPal)</option>
                    <option value="gift-card">Order Gift Card</option>
                    <option value="push-to-card">Push to Debit Card</option>
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label htmlFor="laso-amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (USDC)
                  </label>
                  <input
                    type="number"
                    id="laso-amount"
                    value={lasoParams.amount}
                    onChange={(e) => setLasoParams({...lasoParams, amount: Number(e.target.value)})}
                    min="5"
                    max="9541"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {lasoOperation === 'card' && 'Min: $5, Max: $1000'}
                    {lasoOperation === 'payment' && 'Min: $5, Max: $1000'}
                    {lasoOperation === 'gift-card' && 'Min: $5, Max: $9000'}
                    {lasoOperation === 'push-to-card' && 'Min: $10, Max: $9541.98'}
                  </p>
                </div>

                {/* Payment-specific fields */}
                {lasoOperation === 'payment' && (
                  <>
                    <div>
                      <label htmlFor="laso-platform" className="block text-sm font-medium text-gray-700 mb-1">
                        Platform
                      </label>
                      <select
                        id="laso-platform"
                        value={lasoParams.platform}
                        onChange={(e) => setLasoParams({...lasoParams, platform: e.target.value as 'venmo' | 'paypal'})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="venmo">Venmo</option>
                        <option value="paypal">PayPal</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="laso-recipient" className="block text-sm font-medium text-gray-700 mb-1">
                        Recipient
                      </label>
                      <input
                        type="text"
                        id="laso-recipient"
                        value={lasoParams.recipient}
                        onChange={(e) => setLasoParams({...lasoParams, recipient: e.target.value})}
                        placeholder="@username or email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        required
                      />
                    </div>
                  </>
                )}

                {/* Gift Card Search */}
                {lasoOperation === 'gift-card' && (
                  <div>
                    <label htmlFor="laso-card-id" className="block text-sm font-medium text-gray-700 mb-1">
                      Gift Card ID
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="laso-card-id"
                        value={lasoParams.cardId}
                        onChange={(e) => setLasoParams({...lasoParams, cardId: e.target.value})}
                        placeholder="Search gift cards first..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                      <button
                        type="button"
                        onClick={searchGiftCards}
                        disabled={isLasoLoading}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        {isLasoLoading ? 'Searching...' : 'Search'}
                      </button>
                    </div>
                    {giftCards.length > 0 && (
                      <div className="mt-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
                        {giftCards.map((card: {id: string; name: string}) => (
                          <div
                            key={card.id}
                            onClick={() => setLasoParams({...lasoParams, cardId: card.id})}
                            className="p-2 hover:bg-pink-50 cursor-pointer border-b border-gray-100 last:border-0"
                          >
                            <p className="text-sm font-medium">{card.name}</p>
                            <p className="text-xs text-gray-500">{card.id}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Push to Card */}
                {lasoOperation === 'push-to-card' && (
                  <div>
                    <label htmlFor="laso-card-number" className="block text-sm font-medium text-gray-700 mb-1">
                      Debit Card Number
                    </label>
                    <input
                      type="text"
                      id="laso-card-number"
                      value={lasoParams.cardNumber}
                      onChange={(e) => setLasoParams({...lasoParams, cardNumber: e.target.value})}
                      placeholder="Card number (U.S. only)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLasoLoading}
                  className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg hover:bg-pink-700 transition-colors font-medium disabled:bg-pink-400 disabled:cursor-not-allowed"
                >
                  {isLasoLoading ? 'Processing...' : `Execute ${lasoOperation.replace('-', ' ').toUpperCase()}`}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
