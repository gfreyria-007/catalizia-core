import { Scenario, StudyModule, GlossaryItem } from './types';

export const STUDY_MODULES: StudyModule[] = [
  {
    id: 'intro-ai-architect',
    title: 'Module 1: The AI-Augmented Persona',
    concept: 'Shift from Manual to Orchestrator. You don\'t write code; you provide the "Vibe" and the "Constraint".',
    acronyms: {
      'LLM': 'Large Language Model: The generative motor.',
      'Token': 'The atomic unit of measurement for LLMs.',
      'Context Window': 'The "short-term memory" capacity of the model.'
    },
    deepDive: [
      {
        header: 'The Orchestrator Shift & Cognitive Architectures',
        content: 'In traditional software, the human is the thinker and the machine is the worker. In AI, the model is the worker, and you are the *Designer of Constraints*. This is called "Cognitive Architecture." As a Director, you aren\'t just sending a prompt; you are building a "ReAct" (Reason + Act) loop where the agent thinks, takes an action, observes the result, and repeats. This mimics the human problem-solving process but at 10x speed.'
      },
      {
        header: 'Prompting as System Engineering',
        content: 'Think of a prompt as a structural component. A "System Instruction" is the foundation; a "Few-Shot Example" (showing the AI examples of good work) is the framing. Director-level professionals focus on "Chain of Thought" (CoT) prompting to ensure the model explains its logic before giving a final answer. This is not just "text"; it is instructions for the neural network\'s attention mechanism.'
      },
      {
        header: 'The "Non-Deterministic" QA Challenge',
        content: 'The biggest shift for a QA Director is from "Binary Testing" (Pass/Fail) to "Probabilistic Testing" (Confidence Scores). AI is non-deterministic—meaning it can give two different answers to the same question. Your role is to implement "Consistency Anchors"—a set of fixed constraints that ensure the outputs remain within 95% of expected performance, even if the phrasing changes.'
      },
      {
        header: 'Token Efficiency as a Strategic Moat',
        content: 'Every token has a cost and a latency penalty. Advanced Architects use "Compression Techniques"—writing instructions that are dense and unambiguous. We aim for the "Information Density" sweet spot: enough detail for the model to succeed, but not so much that it loses focus in its 128k context window.'
      }
    ],
    caseStudy: {
      title: 'The Wipro TAT Reduction',
      scenario: 'Manual QA teams were taking 4 hours per PR to verify UI components.',
      solution: 'Implemented an Agentic Reviewer that analyzed the React code, generated its own test cases, and ran them against the dev build.',
      roi: 'Turnaround time (TAT) dropped from 4 hours to 8 minutes per review.'
    },
    comparison: [
      {
        label: 'Work Identity',
        items: [
          { name: 'Legacy Coder', description: 'Writes line-by-line syntax.', pro: 'High granularity.', con: 'Zero scalability in the AI era.' },
          { name: 'Vibe Architect', description: 'Orchestrates agents via natural language.', pro: '10x delivery speed.', con: 'Requires master-level logic precision.' }
        ]
      }
    ],
    executiveTakeaway: 'At the Director level, say: "I utilize AI to eliminate the boilerplate of development, focusing 100% of my capacity on architectural integrity and delivery ROI."'
  },
  {
    id: 'rag-deep-dive',
    title: 'Module 2: RAG & Knowledge Control',
    concept: 'Models have a "cutoff date" (e.g., they don\'t know about your company\'s new policy). RAG solves this.',
    acronyms: {
      'RAG': 'Retrieval-Augmented Generation: Giving the AI a library to look at.',
      'Vector DB': 'A database that stores mathematical "meanings" of words.',
      'Embedding': 'Turning text into a list of 1,000+ numbers that represent flavor/context.'
    },
    deepDive: [
      {
        header: 'The Mechanics of Chunking & Context Window',
        content: 'You cannot stuff a 1,000-page PDF into an LLM at once. We perform "Chunking"—breaking text into discrete blocks (e.g., 512 tokens). Professional pipelines use "Overlapping Chunks" (usually 10-15%) so that the context at the end of Chunk A is repeated at the start of Chunk B, preventing the "Lost in the Middle" phenomenon. Advanced systems use "Semantic Chunking," where the AI identifies when a topic changes and breaks the document at natural logical boundaries rather than fixed word counts.'
      },
      {
        header: 'Vector Math & Retrieval Top-K',
        content: 'What is a Vector? It is a "Coordinate" in a 1,536-dimensional space. Words like "Bank" (money) and "Bank" (river) are placed in different areas of this space based on context. When a user asks a question, we turn their question into a vector and use "Cosine Similarity" to find the Top-K (usually top 5-10) most similar chunks of text. This selection process is what separates a precise expert bot from a hallucinating one.'
      },
      {
        header: 'Measuring the "RAG Triad": Faithfulness, Relevance, Precision',
        content: 'In the industry, we use the RAGAS framework to measure deployment success. "Faithfulness" checks if the answer was actually derived from the source (preventing lies). "Answer Relevance" checks if it actually solved the user\'s problem. "Context Recall" measures if the vector search found the actual needle in the haystack. If your Faithfulness score is low, you don\'t make the model bigger; you fix the chunking strategy.'
      },
      {
        header: 'Latency & Throughput Bottlenecks',
        content: 'RAG adds "Steps" to the lifecycle. Step 1: Embed Query (50ms). Step 2: Vector Search (100ms). Step 3: Context Assembly (20ms). Step 4: Token Generation (2s+). As a Director, you must identify when "Embedding Latency" vs "Inference Latency" is killing the user experience. We utilize "Asynchronous Retrieval" to start fetching data while the UI shows the initial "thinking" animation to hide this overhead.'
      }
    ],
    caseStudy: {
      title: 'The "Linguistic Governance" Gate',
      scenario: 'A global tech client (Intel) had 10,000 internal acronyms that the base AI didn\'t understand.',
      solution: 'Built a specialized RAG pipeline that indexed their internal technical glossaries.',
      roi: 'Reduced "Hallucination Rate" by 85% in technical documentation generation.'
    },
    comparison: [
      {
        label: 'Knowledge Repositories',
        items: [
          { name: 'Pinecone', description: 'SaaS Vector DB.', pro: 'Zero maintenance, scales to billions.', con: 'High managed cost per month.' },
          { name: 'ChromaDB', description: 'Open source local database.', pro: 'Free, perfect for data privacy.', con: 'Harder to manage at enterprise scale.' }
        ]
      }
    ],
    executiveTakeaway: '"We never trust a model\'s base memory. My QA architecture mandates a RAG-first approach with a high-performance Vector Indexing layer."'
  },
  {
    id: 'agentic-orchestration',
    title: 'Module 3: LangGraph & Agentic Cycles',
    concept: 'Simple AI is a straight line. Industrial AI is a loop (Agentic). If it fails, it tries again.',
    acronyms: {
      'LangGraph': 'The industry standard for stateful, cyclic AI workflows.',
      'Stateful': 'The AI remembers "where it is" in a long project.',
      'Cyclic': 'The ability to go backwards and fix an error.'
    },
    deepDive: [
      {
        header: 'Nodes, Edges, and State Management',
        content: 'In LangGraph, an application is a "Graph". A "Node" is a specific function (e.g. an LLM call or a Database tool). An "Edge" is the path between them. "State" is a shared global object that every node can read from and write to. As a Director, you must ensure your state schema is well-defined. If Agent A (Coder) doesn\'t pass the "Error Message" back to Agent B via the shared state, the agentic loop will fail because it "forgot" what it was trying to fix.'
      },
      {
        header: 'The Conditional Edge (The "Decision" Maker)',
        content: 'The real power of Agentic QA is the "Conditional Edge". This is a router function that looks at the output of a node and decides where to go next. "Did the code pass the unit test?" -> If YES, go to "Deployment Node". If NO, go back to "Fix Code Node". This logic replaces thousands of lines of traditional `if/else` statements with a dynamic, self-correcting flow.'
      },
      {
        header: 'Persistence & Checkpointing',
        content: 'Industrial agents need a "Save State". LangGraph uses "Checkpointers". If the server crashes mid-task, the agent can resume exactly where it left off. This is critical for long-running QA tasks (e.g. migrating 10,000 tickets) which might take hours to complete. Without checkpointing, a single network hiccup forces you to restart the entire project.'
      },
      {
        header: 'Human-in-the-loop (Interrupts)',
        content: 'We rarely give agents 100% autonomy in enterprise settings. High-tier architectures implement "Breakpoints". The agent pauses before a critical step (like deleting a database) and waits for a "Human Approval" flag in the state. As a Director, you speak to this as "Controlled Autonomy"—the system is 90% autonomous, but 100% governed.'
      }
    ],
    caseStudy: {
      title: 'Automated Migration (Jira to Workfront)',
      scenario: 'Manual migration of 5,000 project tickets was estimated at 6 months.',
      solution: 'Deployed a LangGraph agent that pulled mapping logic, verified data types, and "self-healed" when the destination API threw errors.',
      roi: 'Migration completed in 3 weeks with 99.8% data integrity.'
    },
    comparison: [
      {
        label: 'Multi-Agent Frameworks',
        items: [
          { name: 'LangGraph', description: 'Low-level control of agent loops.', pro: 'Production-grade, resilient.', con: 'Steeper learning curve.' },
          { name: 'CrewAI', description: 'High-level manager / worker abstractions.', pro: 'Extremely fast to demo.', con: 'Hard to debug when cycles loop infinitely.' }
        ]
      }
    ],
    executiveTakeaway: '"I rely on LangGraph because it allows for stateful error correction. If an agent fails a QA check, the cycle loops back to self-heal based on defined constraints."'
  },
  {
    id: 'ai-qa-evals',
    title: 'Module 4: Automated Evaluations (EVALS)',
    concept: 'Testing AI is a paradox. You use a smart AI (Judge) to grade a faster AI (Student).',
    acronyms: {
      'LLM-as-a-Judge': 'Using a top-tier model (GPT-4o) to evaluate a smaller model (Llama-3).',
      'EVALS': 'Short for Evaluations—the formal process of testing AI quality.',
      'Golden Dataset': 'The source of truth for the "correct" answers.'
    },
    deepDive: [
      {
        header: 'Moving Beyond "Vibe Checks"',
        content: 'Early AI QA relied on "Vibe Checks" (humans reading 5 logs and saying "looks good"). This does not scale. Modern QA uses "Metric-Based EVALS". We measure "Correctness" on a 0-1 scale. If a prompt change drops the "Correctness" score from 0.92 to 0.88 across 1,000 tests, we reject the pull request automatically. This is quantitative certainty for a qualitative technology.'
      },
      {
        header: 'The LLM-as-a-Judge Prompting Strategy',
        content: 'How does an AI judge another AI? We provide the "Judge AI" with the input, the "Student" output, and a very strict "Rubric". The rubric defines exactly what 1/10 vs 10/10 looks like. We use "Reference-Free" (judging on logic alone) or "Reference-Based" (comparing to a golden answer) strategies depending on the use case.'
      },
      {
        header: 'Semantic Similarity vs. BLEU/ROUGE',
        content: 'Legacy NLP scores like BLEU (BiLingual Evaluation Understudy) only check if the words match exactly. They are useless for AI. "Semantic Similarity" uses embeddings to check if the answer has the same *meaning*, even if the words are different. As a Director, you must educate the team on why "Fuzzy Meaning Matching" is the only way to test generative tech.'
      },
      {
        header: 'Continuous Integration for Prompts (Prompt-Ops)',
        content: 'We integrate EVALS into the CI/CD pipeline (Jenkins/GitHub Actions). Every time a developer changes a prompt, the "Golden Dataset" runner triggers. If the model performance falls below the "Quality Floor," the build fails. This is exactly how I ensured 100% deployment reliability during high-stakes delivery at Wipro.'
      }
    ],
    caseStudy: {
      title: 'Product Catalog Validation',
      scenario: 'An e-commerce site had 1M AI-generated descriptions that were often factually wrong.',
      solution: 'Used "DeepEval" (a testing framework) to compare AI descriptions against raw product data.',
      roi: 'Flagged 40,000 factual errors before they ever reached the customer.'
    },
    comparison: [
      {
        label: 'Evaluation Frameworks',
        items: [
          { name: 'DeepEval', description: 'The industry-standard unit testing for AI.', pro: 'Integrates into developer pipelines.', con: 'Requires Python knowledge.' },
          { name: 'Ragas', description: 'Specialized testing for RAG systems.', pro: 'Measures "Faithfulness" and "Relevance".', con: 'Harder to use for general agents.' }
        ]
      }
    ],
    executiveTakeaway: '"My QA strategy centers on LLM-as-a-Judge. We use Golden Datasets to benchmark model performance across time and ensure 95%+ precision before any deployment."'
  },
  {
    id: 'cost-monitoring',
    title: 'Module 5: Token Economics & ROI',
    concept: 'AI isn\'t free. Every time a user types, you pay per word. You need a "GenAI Gateway".',
    acronyms: {
      'Inference': 'The act of a model processing a prompt.',
      'Caching': 'Storing an answer so you don\'t have to pay for it again.',
      'Gateway': 'A central hub that monitors all AI usage across the company.'
    },
    deepDive: [
      {
        header: 'The Hidden Cost of AI: Tokenomics 101',
        content: 'Enterprise AI isn\'t paid for in licenses; it\'s paid for in "Tokens". A single GPT-4o call might cost \$0.01. This sounds small until you have 10,000 employees making 100 calls a day—that is \$10,000/day. As a Director, you must enforce "Token Quotas" at the department level to prevent "Inference Sprawl" where developers accidentally burn \$50k on a recursive loop during testing.'
      },
      {
        header: 'Prompt Caching & Semantic Re-use',
        content: 'Industry leaders like Anthropic and OpenAI now allow "Context Caching". If you have a 500-page manual that you use for RAG, you can cache that manual in the model\'s RAM. This reduces the cost of every subsequent query by up to 90% because you only pay for the "New" tokens in the user\'s question. We also utilize "Semantic Caching" (e.g. using Redis) to detect if two users asked the same question and return the previous answer for \$0 cost.'
      },
      {
        header: 'The GenAI Gateway Architecture',
        content: 'We never allow developers to call OpenAI directly. We sit a "Gateway" (like Helicone or a custom AWS Lambda) in the middle. The gateway performs: 1. Authentication (who is calling?), 2. Rate-Limiting (stopping spam), 3. Cost-Tracking (billing by project ID), and 4. Model Fallback (switching to a cheaper model if the budget is hit). This is the only way to provide C-level visibility into AI ROI.'
      },
      {
        header: 'ROI Calculation for Agentic Systems',
        content: 'When calculating ROI, we compare "Token Cost" vs "Human Labor Savings". If an agent costs \$0.50 to review a document and a human costs \$50 in billable time, the 100x ROI is clear. However, you must factor in the "QA Tax"—the cost of the EVALS and monitoring required to ensure the agent didn\'t hallucinate. A Director knows that a "Cheap Bot" that requires "Expensive Human Review" is actually a negative ROI product.'
      }
    ],
    caseStudy: {
      title: 'Enterprise Cost Governance',
      scenario: 'A company found that developers were accidentally spending \$10k/day on testing.',
      solution: 'Implemented "Helicone" (a gateway) to rate-limit and cache recurring test prompts.',
      roi: 'Reduced monthly AI spend by 40% while doubling the number of successful tests.'
    },
    comparison: [
      {
        label: 'Monitoring Solutions',
        items: [
          { name: 'Helicone / Portkey', description: 'SaaS monitoring layers.', pro: 'Real-time ROI dashboard for C-levels.', con: 'Small privacy trade-off.' },
          { name: 'Custom Gateway (AWS/GCP)', description: 'Built-in cloud monitoring.', pro: 'Ultimate security.', con: 'Requires months of engineering to build.' }
        ]
      }
    ],
    executiveTakeaway: '"I architected a secure Enterprise GenAI Gateway to mandate token caching. This reduced our inference overhead by 30% while giving us a C-level ROI dashboard."'
  },
  {
    id: 'mlops-lifecycle',
    title: 'Module 6: MLOps vs. DevOps',
    concept: 'DevOps is for code. MLOps is for DATA and MODELS. Models "drift" over time and get stupider.',
    acronyms: {
      'Drift': 'When model performance drops because the world changed.',
      'Fine-Tuning': 'Training a model on your specific "vibe" (rarely needed if RAG is good).',
      'Prompt Registry': 'Versioning prompts like we version code.'
    },
    deepDive: [
      {
        header: 'The Lifecycle of a Prompt (Prompt-as-Code)',
        content: 'In standard DevOps, you version your code in Git. In MLOps, we version our "Prompts". You never change a prompt in the production UI; you update a "Prompt Registry". This allows us to run "A/B Tests" between Version 1.0 (strict) and Version 2.0 (creative) and measure which one performs better against our Golden Dataset before the users ever see it.'
      },
      {
        header: 'Monitoring for Semantic Drift',
        content: 'A model that works today might fail tomorrow. Why? "Drift". Perhaps the underlying API provider (OpenAI) updated their model and its "vibe" changed, or perhaps user behavior shifted. We monitor "Semantic Drift" by comparing the vectors of production answers against our baseline. If the "distance" between current answers and expected answers grows too large, the system triggers an "Alert" to the QA Director.'
      },
      {
        header: 'Observability & Tracing (LangSmith)',
        content: 'When an agent fails, you can\'t just look at a log file. You need a "Trace". Tracing shows you exactly which node in the agentic graph failed, what the prompt was, what the retrieved RAG context was, and how much it cost. Tools like LangSmith allow us to debug "Invisible Errors" where the AI gave a "correct" answer but used an "expensive" logic path.'
      },
      {
        header: 'Fine-Tuning vs. RAG Governance',
        content: 'Many people think they need to "Fine-Tune" a model to teach it their data. This is an expensive mistake. Fine-tuning is for "Style" (teaching the AI to talk like a lawyer). RAG is for "Knowledge" (teaching the AI the laws). A Director knows that 95% of enterprise problems are solved by better RAG governance, saving the company hundreds of thousands in training costs.'
      }
    ],
    caseStudy: {
      title: 'The AI Customer Support Crisis',
      scenario: 'A bot started giving out incorrect refund policies after a model update.',
      solution: 'Implemented LangSmith tracing and an automated regression test suite using old Golden Datasets.',
      roi: 'Found the "Prompt Leak" within 2 hours, preventing \$50k in unauthorized refunds.'
    },
    comparison: [
      {
        label: 'Version Control',
        items: [
          { name: 'LangSmith', description: 'Tracing and debugging AI calls.', pro: 'Unmatched visibility, integrates with LangChain.', con: 'Proprietary, can be expensive at scale.' },
          { name: 'Weights & Biases', description: 'Experiment tracking for models.', pro: 'The scientific standard.', con: 'Overkill for simple RAG.' }
        ]
      }
    ],
    executiveTakeaway: '"We treat prompts as code. Using LangSmith, we version every iteration and monitor for drift, ensuring our QA benchmarks remain stable month-over-month."'
  },
  {
    id: 'security-injection',
    title: 'Module 7: Security & Prompt Injection',
    concept: 'Users will try to "jailbreak" your AI (e.g., "Ignore previous instructions"). You need an "Linguistic Firewall".',
    acronyms: {
      'Prompt Injection': 'Hacking an LLM via text inputs.',
      'PII Redaction': 'Removing names/emails before they reach a 3rd party AI.',
      'Sovereign AI': 'Running models on your own servers (VPC) so data never leaves.'
    },
    deepDive: [
      {
        header: 'The Threat of Jailbreaking (DAN & Obfuscation)',
        content: 'Jailbreaking isn\'t always obvious. Advanced attacks use "Obfuscation"—writing the malicious prompt in Base64 or a foreign language to bypass the initial filters. As a Director, you must implement "Recursive Filtering" where the model itself checks the decoded input for intent. We also monitor for "DAN" (Do Anything Now) personas which try to trick the model into ignoring its safety training.'
      },
      {
        header: 'PII Redaction & The Presidio Pattern',
        content: 'Under GDPR/HIPAA, you cannot transmit an SSN or Credit Card number to a cloud LLM. We utilize Microsoft\'s "Presidio" or similar regex-based engines to scrub the data *before* it leaves our VPC. We replace "John Smith" with "[PERSON_1]". The LLM processes the request with placeholders, and we "re-hydrate" the names on the way back to the user logs.'
      },
      {
        header: 'Llama-Guard: The Security Cop',
        content: 'Top-tier architectures don\'t rely on static keywords. We use a secondary model like "Llama-Guard" which is specifically trained to categorize inputs as "Violent", "Hate", "Sexual", or "Policy Violation". If the guard model flags the input, the main model never even sees it. This is the "Double-Gate" security pattern used in high-assurance banking apps.'
      },
      {
        header: 'Model Poisoning & Supply Chain Risk',
        content: 'In standard software, you worry about npm packages. In AI, you worry about "Model Weights". If you download a fine-tuned model from HuggingFace, it could have a "Backdoor" that triggers when a specific keyword is used. My QA mandate requires all models to be scanned using tools like "SafeTensors" to ensure no malicious code is embedded in the neural network file.'
      }
    ],
    caseStudy: {
      title: 'The Fintech Data Leak Preemption',
      scenario: 'A banking agent was found to be "remembering" credit card numbers in its local logs.',
      solution: 'Deployed a Presidio-based redaction gate and switched to self-hosted "vLLM" models.',
      roi: 'Achieved 100% HIPAA compliance while maintaining GPT-level performance.'
    },
    comparison: [
      {
        label: 'Security Posture',
        items: [
          { name: 'Azure OpenAI', description: 'Microsoft\'s secure cloud AI.', pro: 'Enterprise-grade SLAs, data isn\'t trained on.', con: 'Expensive, still technically "cloud".' },
          { name: 'Ollama / vLLM', description: 'Self-hosted open models (Llama 3).', pro: '100% data sovereignty.', con: 'Requires expensive GPUs.' }
        ]
      }
    ],
    executiveTakeaway: '"Data security is non-negotiable. I deploy a Linguistic Governance Gate to scrub PII and prevent high-level prompt injection attacks."'
  },
  {
    id: 'edge-cases-hallucination',
    title: 'Module 8: Hallucination Mitigation',
    concept: 'AI lies with confidence. You need "Guardrails" (Self-Check loops).',
    acronyms: {
      'Guardrails': 'Code that enforces strict output formats (JSON, XML).',
      'Factuality Score': 'A metric measuring how many "Facts" in a response are true.',
      'Grounding': 'Forcing the AI to quote its source (e.g., "According to page 4...").'
    },
    deepDive: [
      {
        header: 'The Hallucination Paradox & Temperature Control',
        content: 'Why does AI lie? It\'s usually due to "Temperature"—a setting that controls randomness. High temperature (0.9) is for poetry; low temperature (0.1) is for critical QA. As a Director, you must mandate "Zero-Temperature Inference" for all task-oriented bots to minimize the stochastic nature of the output.'
      },
      {
        header: 'Self-Correction & Critique Loops',
        content: 'Advanced systems use "Reflexion". The model drafts an answer, then a "Critic Agent" reviews it for hallucinations and sends it back for a rewrite. This mimics the human editorial process and can reduce hallucination rates by up to 40% in complex technical tasks.'
      },
      {
        header: 'Citations & Verifiable Grounding',
        content: 'We tell the AI: "If the answer is not in the provided documents, say I don\'t know. If it IS in the documents, providing a [Source: Page X] citation is mandatory." We then use a secondary QA script to verify if the citation actually exists. This creates a "Paper Trail" for every claim the AI makes.'
      },
      {
        header: 'Schema Enforcement (JSON Mode)',
        content: 'Hallucinations often happen when the AI tries to be too "chatty". By forcing the AI into "JSON Mode" (using libraries like Outlines or Guardrails AI), we constrain the output to a strict computer-readable format. This makes it impossible for the AI to add "fluff" or conversational hallucinations that mislead the user.'
      }
    ],
    caseStudy: {
      title: 'Medical Advisory App',
      scenario: 'High-risk hallucination where the AI was suggesting wrong drug dosages.',
      solution: 'Implemented a 3-step validation: Document Retrieval -> Expert Fact-Check Agent -> Formula Verification.',
      roi: 'Hallucinations in dosage calculations dropped to 0% across 50,000 test cases.'
    },
    comparison: [
      {
        label: 'Guardrail Libraries',
        items: [
          { name: 'Guardrails AI', description: 'Strict schema validation.', pro: 'Ensures output is 100% valid JSON/code.', con: 'Can make the AI feel "robotic".' },
          { name: 'NeMo Guardrails', description: 'Programmable security by Nvidia.', pro: 'Incredible control over conversational flow.', con: 'Very high engineering complexity.' }
        ]
      }
    ],
    executiveTakeaway: '"We mitigated hallucination by implementing a 3-stage Guardrail system: Structural Check -> Fact Check -> Tone Check. This is the core of our AI Trust Layer."'
  },
  {
    id: 'scaling-agents',
    title: 'Module 9: Scaling Agentic Commerce',
    concept: 'Turning one agent into 1,000. How to handle "Agent Latency" for high-traffic apps.',
    acronyms: {
      'Latency': 'The time it takes for the AI to "think" and start typing.',
      'Throughput': 'How many messages the system handles per second.',
      'Load Balancing': 'Distributing AI tasks across multiple model providers (e.g., Anthropic + Google).'
    },
    deepDive: [
      {
        header: 'The Latency Problem: TTFT vs. P99',
        content: 'We measure "Time to First Token" (TTFT). If TTFT is >500ms, users perceive the app as "Broken". Even if the whole answer takes 10 seconds, as long as it *starts* immediately, the UX is saved. We use "Streaming" to send the answer piece-by-piece rather than waiting for the whole paragraph to finish. For complex agents, we utilize "UI Optimism"—showing the internal thoughts of the agent to keep the user engaged during the 20-second "think" cycle.'
      },
      {
        header: 'Model Routing & Fallbacks',
        content: 'At the Director level, you must plan for "Rate Limits". If OpenAI goes down, does your whole company stop? You need "Fallback Logic" that automatically switches to a backup model (like Gemini) if the primary fails. We use "Semantic Routers" to send easy questions to small models (cheap/fast) and hard questions to large models (expensive/slow) to maximize both speed and budget.'
      },
      {
        header: 'Queue Management & Webhooks',
        content: 'Agentic cycles can take 60+ seconds. Web browsers timeout after 30. We use "Asynchronous Workflows". The user submits a request, we return a "Job ID" immediately, and use a "Webhook" to push the final AI answer once the agents are done. This prevents the "504 Gateway Timeout" errors that plague unoptimized AI apps and allows for background processing of millions of documents.'
      },
      {
        header: 'Horizontal Scaling of Inference Engines',
        content: 'Scaling AI isn\'t like scaling web servers. It requires massive Video RAM (VRAM). We use "Kubernetes with GPU scheduling" to spin up new pods of vLLM when traffic spikes. A Director must understand that the bottleneck isn\'t the CPU or RAM—it\'s the number of A100/H100 cards in your cluster and the KV Cache management which controls how many simultaneous conversations one card can handle.'
      }
    ],
    caseStudy: {
      title: 'Black Friday AI Response',
      scenario: 'A retail bot crashed when traffic hit 5,000 queries per minute.',
      solution: 'Implemented a "Model Router" that shifted traffic between Claude and GPT-4 based on availability.',
      roi: 'Maintained 99.9% uptime during the year\'s highest traffic peak.'
    },
    comparison: [
      {
        label: 'Backend Stacks',
        items: [
          { name: 'FastAPI / Python', description: 'The "Native" choice for ML.', pro: 'Largest library support for AI.', con: 'Global Interpreter Lock (GIL) can hinder scaling.' },
          { name: 'Node.js / Go', description: 'High-performance concurrency.', pro: 'Best for real-time streaming and massive scale.', con: 'Fewer ready-made ML libraries.' }
        ]
      }
    ],
    executiveTakeaway: '"In my Wipro tenure, I focused on high-throughput Agentic systems. We pivoted to Async Agent cycles and Multi-Model Routing to ensure 100% KPI green status."'
  },
  {
    id: 'future-trends',
    title: 'Module 10: The Sovereign Executive',
    concept: 'The future is NOT the cloud. It is local, private models (Sovereign AI).',
    acronyms: {
      'Sovereign AI': 'Owning your model, your data, and your hardware.',
      'Edge AI': 'Running AI on a local laptop or phone instead of the cloud.',
      'SLM': 'Small Language Model (e.g., Llama 3 - 8B, Phi-3).'
    },
    deepDive: [
      {
        header: 'Hardware Sovereignty: H100s vs. Consumer GPUs',
        content: 'AI Director insight: You don\'t always need a \$40,000 H100. For many 8B parameters models (LLama-3), prosumer cards like the RTX 4090 or a \$5,000 Mac Studio with 192GB of Unified Memory can run inference faster than many cloud APIs. We use "Quantization" (converting 32-bit model weights to 4-bit) to shrink a 50GB model down to 8GB with almost 0% loss in intelligence, allowing us to run high-speed AI on local servers.'
      },
      {
        header: 'Orchestrating the Local Stack (vLLM & Kubernetes)',
        content: 'We don\'t install models directly on the OS. We use "vLLM" (Very Large Language Model) serving engines inside Docker containers managed by Kubernetes. This keeps the environment "Hermetic"—meaning the model dependencies never conflict with the main app. This allows for "Hot-Swapping" models in seconds without rebooting the main application infrastructure.'
      },
      {
        header: 'Data Privacy as a Competitive Moat',
        content: 'If your competitor is using GPT-4, they are leaking their business logic and user data trends to OpenAI. If you are using a Sovereign Model (Llama-3 fine-tune inside your VPC), your IP never leaves your firewall. This is the ultimate defense for sectors like Healthcare and Defense. A Director\'s goal is to transition the company from "API-Dependency" to "In-House Intelligence Foundations".'
      },
      {
        header: 'The Rise of the SLM (ROI and Sustainability)',
        content: 'Large models (GPT-4) are overkill for 80% of tasks. Small Language Models (SLMs) like Microsoft\'s Phi-3 or Meta\'s Llama-3-8B are 10x cheaper to run, 5x faster, and consume 90% less energy. For a Director, "Sovereignty" means picking the *smallest* model that can do the job perfectly, maximizing both corporate sustainability and financial ROI.'
      }
    ],
    caseStudy: {
      title: 'The Sovereign EdTech Pivot',
      scenario: 'An EdTech platform (Catalizia) needed to handle student data with 0% cloud risk.',
      solution: 'Migrated from cloud APIs to private "Llama-3" models running on a secure VPS/Docker stack.',
      roi: 'Zero data egress to 3rd parties and a 70% reduction in long-term operational costs.'
    },
    comparison: [
      {
        label: 'The Horizon',
        items: [
          { name: 'Hyper-Scale Clouds', description: 'Azure/Google AI.', pro: 'Zero setup, instant power.', con: 'Zero data sovereignty, high platform risk.' },
          { name: 'Private Infrastructure', description: 'Docker + VPS + Open Source Models.', pro: 'Absolute privacy, owned IP.', con: 'Requires senior architectural vision.' }
        ]
      }
    ],
    executiveTakeaway: '"The next shift is Sovereignty. I manage my own VPS and Docker environments because I believe the highest-tier enterprise AI must reside in a private, owned VPC."'
  },
  {
    id: 'cloud-infra-director',
    title: 'Module 11: Enterprise Cloud vs. Simple VPS',
    concept: 'Why an Architect picks AWS/Azure over Hostinger/Sandbox. It\'s about IAM, VPC, and GPU clusters.',
    acronyms: {
      'VPC': 'Virtual Private Cloud: Your own private island in the cloud.',
      'IAM': 'Identity & Access Management: Who can touch the GPUs.',
      'Cold Start': 'The delay when a lambda/container starts from zero.'
    },
    deepDive: [
      {
        header: 'Hostinger/VPS vs. Enterprise AWS/Azure',
        content: 'A VPS (Hostinger) is a "black box" server. It\'s great for small blogs. But in AI QA, we need "GPU Clusters" and "Private Endpoints". If you run a confidential finance bot on a cheap VPS, your data traverses the public internet. On AWS, we use "VPC Peering" so the data never leaves the internal Amazon fiber. This is a non-negotiable security requirement for AI Directors.'
      },
      {
        header: 'The GPU Cost Trap',
        content: 'AWS allows you to "Spot Instance"—essentially renting unused supercomputers for 70% off. You can\'t do this on Hostinger. An Architect designs a system that spins up an A100 GPU for a heavy QA test and kills it 5 minutes later. This is "Elastic Infrastructure"—paying for intelligence only when you use it.'
      },
      {
        header: 'Containerization & Kubernetes (EKS)',
        content: 'We don\'t install AI on servers; we deploy it in Docker. If your bot hits 1M users, you need Kubernetes (EKS) to spin up 50 copies of your model across 20 servers instantly. This is "Horizontal Scaling". A Director doesn\'t manage servers; they manage "Orchestration Blueprints".'
      },
      {
        header: 'Data Gravity & AWS PrivateLink',
        content: 'Industry Architects solve "Data Gravity" (large datasets that are hard to move). If your database is in AWS Virginia (us-east-1), you must run your AI in the same region. We use **AWS PrivateLink** to connect our AI VPC to our Database VPC. This ensures the data never crosses the "Public Internet" (even encrypted), drastically reducing latency and fulfilling the "Zero Trust" security architecture required by C-levels.'
      },
      {
        header: 'The AWS Transit Gateway Pattern',
        content: 'When a company has 50 different AWS accounts (one for HR, one for Finance, etc.), we don\'t connect them all manually. We use a **Transit Gateway**. It acts as a central "Router" for the whole company\'s network. This allows an AI QA Director to run a single "Testing Hub" that can safely access data from any department without opening risky firewall holes.'
      }
    ],
    caseStudy: {
      title: 'Global Bank Migration',
      scenario: 'A fintech startup was running on a private VPS and hit a 30-second latency wall.',
      solution: 'Migrated to AWS Bedrock with VPC endpoints and SageMaker inference scaling.',
      roi: 'Latency dropped to 800ms; security compliance met 100% of SOC2 requirements.'
    },
    comparison: [
      {
        label: 'Infrastructure Tiers',
        items: [
          { name: 'AWS / Azure / GCP', description: 'Hyper-scale cloud providers.', pro: 'Unlimited scale, GPU availability, IAM security.', con: 'Extreme billing complexity.' },
          { name: 'Hostinger / DigitalOcean', description: 'Standard VPS providers.', pro: 'Flat monthly cost, simple setup.', con: 'Zero GPU scaling, lower security guarantees.' }
        ]
      }
    ],
    executiveTakeaway: '"I architect for the Enterprise. We utilize AWS not just for compute, but for VPC-integrated security and Spot Instance cost-optimization that a standard VPS cannot provide."'
  },
  {
    id: 'advanced-retrieval-engineering',
    title: 'Module 12: Advanced RAG - HyDE & Reranking',
    concept: 'Basic RAG fails 30% of the time. Advanced RAG uses "Hypothetical Documents" and "Rerankers" for 99% accuracy.',
    acronyms: {
      'HyDE': 'Hypothetical Document Embeddings: Generating a "fake" perfect answer to find the "real" document.',
      'Cross-Encoder': 'A smarter (but slower) AI that re-orders your search results.',
      'Top-K': 'The number of documents retrieved from the vector store.'
    },
    deepDive: [
      {
        header: 'Hypothetical Document Embeddings (HyDE)',
        content: 'Sometimes a user question is too short to find a good vector match. HyDE fixes this. We ask the AI: "Write a fake perfect answer to this question." We then use that *Fake Answer* to search the database. Because the fake answer contains the right keywords, it finds the *Real Document* with much higher precision.'
      },
      {
        header: 'The Reranking Step (Cohere/BGE)',
        content: 'Vector search is "Fast but Dumb". It might find 20 documents that look relevant but aren\'t. We use a "Reranker" (Cross-Encoder) as a second phase. It looks at all 20 and picks the top 3 with extreme precision. This is the "Architectural Guardrail" that prevents the model from reading irrelevant data.'
      },
      {
        header: 'Multi-Query Expansion',
        content: 'Users are bad at asking questions. We take one user question and ask the AI to rewrite it into 5 different versions. we search for ALL 5 versions. This "Broad Net" strategy ensures we never miss a chunk because of a synonym or a typo.'
      }
    ],
    caseStudy: {
      title: 'Legal Discovery Automation',
      scenario: 'Attorneys couldn\'t find specific clauses in 50,000-page contracts using standard search.',
      solution: 'Implemented a HyDE + Cohere Reranker pipeline.',
      roi: 'Search accuracy went from 62% to 98%.'
    },
    comparison: [
      {
        label: 'Search Strategies',
        items: [
          { name: 'Semantic Search', description: 'Standard Vector lookup.', pro: 'Fast, cheap.', con: 'High hallucination in complex data.' },
          { name: 'HyDE + Rerank', description: 'Advanced multi-stage retrieval.', pro: 'Near-human precision.', con: 'Adds 200ms of latency per query.' }
        ]
      }
    ],
    executiveTakeaway: '"Precision is our KPI. My architecture mandates a Reranking layer to validate vector results before they ever reach the context window."'
  },
  {
    id: 'gpu-vram-orchestration',
    title: 'Module 13: VRAM Dynamics & Hardware Choice',
    concept: 'An Architect must know the difference between an A100 and a 4090. It\'s about VRAM and Interconnect.',
    acronyms: {
      'VRAM': 'Video RAM: The memory that holds the model.',
      'NVLink': 'A super-fast bridge between two GPUs.',
      'Quantization': 'Shrinking a model from 16-bit to 4-bit.'
    },
    deepDive: [
      {
        header: 'VRAM: The Bottleneck of Intelligence',
        content: 'A model like Llama-3-70B requires about 140GB of memory to run. An A100 GPU only has 80GB. An Architect knows you must "Shred" the model across two GPUs. This is "Model Parallelism". If your server doesn\'t have NVLink, the GPUs can\'t talk fast enough, and your "Intelligence speed" drops to a crawl.'
      },
      {
        header: 'Nvidia A100 vs. H100 vs. L40S',
        content: 'H100 is 3x faster than A100 for "Inference". But the L40S is often cheaper for "RAG workloads". A Director makes "Unit-Economic" choices. Why pay for a Ferrari (H100) if you are just driving to the store (simple text classification)?'
      },
      {
        header: 'The Apple Silicon Moat (Unified Memory)',
        content: 'In 2024, Mac Studios became secret weapons. Because they have "Unified Memory," you can use 192GB of RAM for an AI model. Standard PCs are capped by the GPU memory. For private, local QA labs, a Mac Studio is often 5x more cost-effective than an AWS instance.'
      }
    ],
    caseStudy: {
      title: 'Local Privacy Pivot',
      scenario: 'A defense contractor couldn\'t use the cloud but needed to run a 70B parameter model.',
      solution: 'Deployed a cluster of 4x Mac Studio M2 Ultras with unified memory pooling.',
      roi: 'Zero data egress, zero monthly cloud bill, 100% localized sovereign AI.'
    },
    comparison: [
      {
        label: 'Hardware Stacks',
        items: [
          { name: 'Nvidia H100 Cluster', description: 'The gold standard of compute.', pro: 'Fastest training/inference.', con: 'Near-impossible to find/rent.' },
          { name: 'Apple M3 Ultra', description: 'Consumer-pro unified memory.', pro: 'Massive VRAM for the price.', con: 'Slower than dedicated H100s.' }
        ]
      }
    ],
    executiveTakeaway: '"I don\'t just deploy software; I orchestrate compute. We match the VRAM profile of the model to the specific GPU interconnect to ensure 0% memory bottleneck."'
  },
  {
    id: 'ai-observability-stack',
    title: 'Module 14: LangSmith vs. Phoenix - Observability',
    concept: 'LangGraph builds the brain. LangSmith is the microscope. You need both to survive production.',
    acronyms: {
      'Observability': 'Understanding what the AI did and why.',
      'Trace': 'The step-by-step history of one AI thought.',
      'Dataset Pinning': 'Saving a specific "failed" query to your test suite.'
    },
    deepDive: [
      {
        header: 'LangGraph vs. LangSmith',
        content: 'They are not competitors; they are a duo. **LangGraph** handles the logic flow (the "Directed Acyclic Graph"). **LangSmith** records that flow. If an agent loops 50 times accidentally, LangSmith shows you the "Loop Trace" so you can fix the logic. A Director mandates LangSmith for all prod environments to ensure "Governance Visibility".'
      },
      {
        header: 'Arize Phoenix vs. LangSmith',
        content: 'LangSmith is great if you use LangChain. But if you use custom Python code, you might pick **Arize Phoenix**. It is "Open Source" and "Model Agnostic". It allows you to visualize "Embedding Clusters"—letting you *see* if your data is messy or well-organized in 3D space.'
      },
      {
        header: 'Shadow Deployments',
        content: 'We never "Replace" an old bot with a new one. we run the new bot in "Shadow Mode". It sees the same questions but its answers aren\'t shown to the user. We use LangSmith to compare the new bot\'s answers to the old one. If the new bot scores higher on EVALS for a week, *then* we flip the switch.'
      }
    ],
    caseStudy: {
      title: 'The Unseen Loop Fix',
      scenario: 'An agent was spending \$500/day on "No results found" loops.',
      solution: 'Integrated LangSmith traces to identify the infinite loop condition.',
      roi: 'Fixed the bug in 10 minutes; saved \$15k/month in wasted tokens.'
    },
    comparison: [
      {
        label: 'Observability Tools',
        items: [
          { name: 'LangSmith', description: 'Deep integration with LangChain ecosystem.', pro: 'Seamless setup, best-in-class debugging.', con: 'Closed source, SaaS only.' },
          { name: 'Arize Phoenix / Weights & Biases', description: 'Developer-first observability.', pro: 'Open source, works with any LLM SDK.', con: 'Requires more setup manual work.' }
        ]
      }
    ],
    executiveTakeaway: '"Architecture without observability is a black hole. We utilize LangSmith Tracing to audit every decision path, ensuring 100% logical accountability."'
  },
  {
    id: 'corporate-ai-governance',
    title: 'Module 15: AI Ethics, Compliance & Model Carding',
    concept: 'The EU AI Act and SOC2 change how we build AI. We need "Model Cards" and "Bias Testing".',
    acronyms: {
      'Bias Testing': 'Ensuring the AI doesn\'t discriminate based on race/gender.',
      'Model Card': 'The "Nutrition Label" of an AI model.',
      'Data Lineage': 'Knowing exactly where the training data came from.'
    },
    deepDive: [
      {
        header: 'The EU AI Act & Regulatory QA',
        content: 'In 2025, AI becomes regulated like medical devices. If your AI makes a financial decision, you *must* prove it isn\'t biased. As a Director, you implement "Adversarial Bias Testing". We use a "Red Team Agent" to try and trick the bot into giving unfair answers. If it fails, the bot is decommissioned.'
      },
      {
        header: 'Model Carding (The Nutrition Label)',
        content: 'Every model in our company must have a "Model Card". It lists: 1. Training Cutoff, 2. Known Weaknesses (e.g. "Bad at math"), 3. Intended Use and 4. Licensing. This prevents developers from accidentally using a "Research Only" model in a "Commercial" product.'
      },
      {
        header: 'Governance Frameworks (NIST AI RMF)',
        content: 'We don\'t make up rules; we follow the NIST AI Risk Management Framework. This involves "Measure, Manage, Map, and Govern". It turns "Vague AI Worry" into a literal spreadsheet of risks and mitigations. This is how you win over a C-level Board of Directors.'
      }
    ],
    caseStudy: {
      title: 'Public Sector Deployment',
      scenario: 'A government agency needed an AI for public grants but feared bias.',
      solution: 'Implemented a Bias Testing suite and a public-facing Model Card.',
      roi: 'Achieved 100% regulatory approval and zero public complaints about fairness.'
    },
    comparison: [
      {
        label: 'Governance Standards',
        items: [
          { name: 'NIST AI RMF', description: 'The US standard for risk.', pro: 'Extremely detailed, enterprise-ready.', con: 'Very heavy documentation burden.' },
          { name: 'EU AI Act', description: 'The legal mandate for Europe.', pro: 'Mandatory compliance, high trust.', con: 'Strict penalties (up to 7% turnover).' }
        ]
      }
    ],
    executiveTakeaway: '"Sustainability in AI means Governance. I lead with the NIST framework, ensuring every model has a transparent Card and a verified Bias-Free certification."'
  },
  {
    id: 'langgraph-multi-agent',
    title: 'Module 16: LangGraph & Multi-Agent Orchestration',
    concept: 'Moving beyond linear chains to cyclical, state-aware agent networks.',
    acronyms: {
      'Stateful Graph': 'A system that maintains memory across multiple turns and nodes.',
      'Persistence': 'Saving the state of an agent so it can resume after a crash or human approval.',
      'Nodes & Edges': 'The logic units (nodes) and the decision paths (edges) between them.'
    },
    deepDive: [
      {
        header: 'LangGraph vs Standard LangChain',
        content: 'Standard LangChain is a Directed Acyclic Graph (DAG) — it only goes forward. LangGraph allows for "Cycles" (loops). This is essential for "Self-Correcting Agents". For example, an agent writes code, another agent tests it, and if it fails, it "loops" back to the writer. This cyclical reasoning is what creates "Agency".'
      },
      {
        header: 'Human-in-the-loop (HITL)',
        content: 'As a Director, you cannot trust AI with a $1MM purchase. LangGraph allows "Interrupts". The agent builds the order, "steps" to an approval node, and *waits* for a human button click before continuing. This turns "Black Box AI" into "Controllable Enterprise Software".'
      },
      {
        header: 'Persistence and Threading',
        content: 'Enterprise agents need "Threads". LangGraph uses Checkpointers (Postgres/Redis) to save every step. If a server dies mid-calculation, the agent recovers from the exact last node. This satisfies the "Reliability" pillar of your QA strategy.'
      }
    ],
    caseStudy: {
      title: 'Global Supply Chain Orchestration',
      scenario: 'A logistics firm needed to coordinate 5 different APIs with error correction.',
      solution: 'Built a LangGraph multi-agent system with a built-in "Retry Cycle".',
      roi: 'Reduced manual coordination hours by 85% and eliminated empty-container errors.'
    },
    comparison: [
      {
        label: 'Agent Frameworks',
        items: [
          { name: 'LangGraph', description: 'Low-level control over state and loops.', pro: 'Highly customizable, great persistence.', con: 'Steeper learning curve than CrewAI.' },
          { name: 'CrewAI / AutoGen', description: 'Higher level "Role-Based" agents.', pro: 'Very fast to prototype simple team tasks.', con: 'Harder to control exact logical transitions.' }
        ]
      }
    ],
    executiveTakeaway: '"I prioritize LangGraph for enterprise workloads because it provides the Persistence and Human-in-the-loop controls that critical business ops demand."'
  },
  {
    id: 'deepeval-qa-revolution',
    title: 'Module 17: DeepEval & RAGAS - Automated Evals',
    concept: 'Replacing manual QA with "LLM-as-a-Judge" automated metrics.',
    acronyms: {
      'G-Eval': 'Using a smart model (GPT-4) to grade a smaller model based on a rubric.',
      'Faithfulness': 'Measuring if the answer is grounded solely in the retrieved context.',
      'Answer Relevancy': 'A score indicating how well the response actually addresses the user\'s intent.'
    },
    deepDive: [
      {
        header: 'The Death of Manual Testing',
        content: 'You cannot manually test 1,000 RAG queries every day. We use DeepEval to automate "Unit Testing for AI". Every time a developer pushes code, DeepEval runs and checks "Faithfulness" (did it hallucinate?) and "Answer Relevancy". If the score is < 0.8, the build fails.'
      },
      {
        header: 'RAGAS Metrics (The Golden Triad)',
        content: 'Ragas focuses on three critical vectors: 1. Context Precision (did we find the right docs?), 2. Context Recall (did we find *all* the right docs?), and 3. Faithfulness. This gives you a mathematical "Quality Score" you can present to Sam Davitt to prove ROI.'
      },
      {
        header: 'Synthetic Data Generation',
        content: 'One of the biggest QA bottlenecks is "Test Data". Both DeepEval and Ragas can "crawl" your documentation and generate 500 "Golden Questions" with "Ground Truth" answers. This allows you to test your architecture before a single human user ever touches it.'
      }
    ],
    caseStudy: {
      title: 'Financial Advisory Bot QA',
      scenario: 'A bank feared "Technical Hallucinations" in their investment bot.',
      solution: 'Integrated DeepEval into the CI/CD pipeline with strict Faithfulness gates.',
      roi: 'Identified and blocked 42 potential hallucinations during the beta phase.'
    },
    comparison: [
      {
        label: 'Eval Frameworks',
        items: [
          { name: 'DeepEval', description: 'Comprehensive suite for unit testing.', pro: 'Excellent CLI, integrates with Pytest.', con: 'Can be expensive in "LLM Judge" tokens.' },
          { name: 'RAGAS', description: 'The industry standard for retrieval metrics.', pro: 'Best mathematical metrics for RAG.', con: 'Harder to integrate into enterprise CI/CD than DeepEval.' }
        ]
      }
    ],
    executiveTakeaway: '"I transform QA from a manual bottleneck into an automated "Eval Logic Gate" using DeepEval, ensuring only 0.9+ Faithfulness models reach production."'
  },
  {
    id: 'arize-phoenix-observability',
    title: 'Module 18: Arize Phoenix & Observability',
    concept: 'Tracing the "Ghost in the Machine" through distributed span analysis.',
    acronyms: {
      'Tracing': 'Recording every sub-call (retrieval, llm, tool) in a single request.',
      'Span': 'A single unit of work within a trace (e.g. "Pinecone Query").',
      'Root Cause Analysis (RCA)': 'Finding exactly which step caused the AI to fail.'
    },
    deepDive: [
      {
        header: 'Finding the "Needle in the Haystack"',
        content: 'When an AI fails, you need to know *where*. Did the Vector DB return bad data? Or did the LLM ignore the context? Arize Phoenix provides an "OpenTelemetry" compatible trace. You see exactly how many milliseconds the Pinecone query took and what the raw JSON response was.'
      },
      {
        header: 'Spans and Nested Logic',
        content: 'An Agentic call often looks like a tree. Arize Phoenix displays this as a "Nested Trace". You can see "Agent Loop 1" -> "Tool Call" -> "LLM Parse". This is critical for debugging sub-second latency issues that Sam Davitt hates.'
      },
      {
        header: 'Embedding Visualization',
        content: 'Phoenix allows you to visualize your "Vector Space" in 3D. If your AI is confused between "Checking Balance" and "Closing Account", you will see those two clusters overlapping in the 3D map. You can then fix the "Semantic Drift" by adjusting your chunking strategy.'
      }
    ],
    caseStudy: {
      title: 'Customer Support Latency Audit',
      scenario: 'A bot was taking 12 seconds to respond. Stakeholders were furious.',
      solution: 'Used Phoenix tracing to discover a "Hidden Loop" in a legacy tool-call.',
      roi: 'Reduced latency from 12s to 3s by optimizing the specific bottleneck span.'
    },
    comparison: [
      {
        label: 'Observability Stack',
        items: [
          { name: 'Arize Phoenix', description: 'Open source, developer-first tracing.', pro: 'Free, locally hostable, massive features.', con: 'Requires technical setup and server hosting.' },
          { name: 'LangSmith', description: 'SaaS observability by LangChain.', pro: 'Zero setup, beautiful UI, works out-of-box.', con: 'Expensive once you hit production scale.' }
        ]
      }
    ],
    executiveTakeaway: '"I manage AI performance through observability. We use Phoenix to maintain a "Trace Ledger", ensuring every sub-call is audit-ready and latency-optimized."'
  },
  {
    id: 'wandb-lifecycle-tracking',
    title: 'Module 19: Weights & Biases (W&B) - LLMOps',
    concept: 'Tracking experiments, fine-tuning artifacts, and model lineage.',
    acronyms: {
      'Experiment Tracking': 'Logging hyper-parameters and loss curves during training.',
      'Artifacts': 'Version-controlled files (datasets, model weights, results).',
      'W&B Prompts': 'A tool specifically for visualizing prompt-engineering versions.'
    },
    deepDive: [
      {
        header: 'The "Lab Notebook" for AI',
        content: 'If you try a new "System Prompt" today and it works better, how do you remember what you did tomorrow? W&B logs every single version of your prompt and the resulting metric. It creates a "Leaderboard" of your internal experiments so you pick the winner based on data, not "Vibes".'
      },
      {
        header: 'Fine-Tuning Observability',
        content: 'When fine-tuning a model (e.g. Llama-3) on company data, you must monitor the "Loss Curve". W&B shows you in real-time if the model is "Overfitting" (memorizing data instead of learning). This prevents deploying a model that is technically broken.'
      },
      {
        header: 'Model Lineage and Audit',
        content: 'For SOC2 compliance, you must prove which version of the model was running on November 12th. W&B "Artifacts" creates a cryptographic link between the Training Data, the Prompt, and the Model Weights. It provides the "Chain of Custody" for your AI assets.'
      }
    ],
    caseStudy: {
      title: 'Medical AI Model Carding',
      scenario: 'A health-tech startup needed to prove model stability for FDA audit.',
      solution: 'Used W&B Artifacts to track every data revision and training run.',
      roi: 'Passed the audit with 100% data transparency and successful version rollback capability.'
    },
    comparison: [
      {
        label: 'Lifecycle Management',
        items: [
          { name: 'Weights & Biases', description: 'The gold standard for experiment tracking.', pro: 'Best community support, works with PyTorch.', con: 'Features can be overwhelming for beginners.' },
          { name: 'MLflow', description: 'The open-source alternative from Databricks.', pro: 'Great for generic ML, very industrial.', con: 'Prompt engineering features feel "tacked on".' }
        ]
      }
    ],
    executiveTakeaway: '"My LLMOps strategy centers on Weights & Biases. It provides the "System of Record" for our experiments, ensuring every model is a documented, verifiable asset."'
  },
  {
    id: 'ai-gateways-guarding',
    title: 'Module 20: AI Gateways - Portkey & Helicone',
    concept: 'The "Smart Proxy" layer for reliability, caching, and cost control.',
    acronyms: {
      'Semantic Caching': 'Checking if a "similar" question was asked before to return the cached answer.',
      'Load Balancing': 'Distributing requests between Azure, OpenAI, and Local Ollama.',
      'Gateway': 'A single URL that proxies all your AI calls.'
    },
    deepDive: [
      {
        header: 'The "Enterprise Air Gap" Proxy',
        content: 'You should never let your app talk directly to OpenAI. We use an AI Gateway (Portkey). The app talks to Portkey, and Portkey handles the security, API keys, and rate-limiting. This allows you to "Swap" models (from GPT-4 to Claude) by changing one line in the gateway config.'
      },
      {
        header: 'Semantic Caching (The ROI Secret)',
        content: 'If someone asks "What is your refund policy?" ten times, why pay for GPT-4 ten times? Portkey uses "Semantic Caching". It sees the questions are similar and returns the previous answer from the cache. This reduces token costs by up to 40% and cuts latency to <50ms.'
      },
      {
        header: 'Reliability and Fallback',
        content: 'OpenAI goes down. It\'s a fact. A Gateway allows "Automatic Fallback". If OpenAI returns a 500 error, Portkey automatically retries the request with Azure OpenAI or your local vLLM instance. The user never sees an error. This is "Zero-Downtime AI".'
      }
    ],
    caseStudy: {
      title: 'Scaling to 10M Tokens/Day',
      scenario: 'An e-commerce bot was bleeding money due to redundant queries.',
      solution: 'Implemented Helicone for semantic caching and budget rate-limiting.',
      roi: 'Monthly AI spend decreased by 32% while performance and reliability metrics increased.'
    },
    comparison: [
      {
        label: 'AI Gateways',
        items: [
          { name: 'Portkey', description: 'Enterprise-grade orchestration.', pro: 'Best load-balancing and "Virtual Keys".', con: 'Enterprise pricing for high scale.' },
          { name: 'Helicone', description: 'Developer-focused simplicity.', pro: 'Extremely easy setup, great logging.', con: 'Fewer advanced multi-model fallback rules.' }
        ]
      }
    ],
    executiveTakeaway: '"Architecture is about resilience. We use AI Gateways to decouple our app from specific providers, providing the Semantic Caching and Fallback logic that keeps us online and under budget."'
  }
];

export const SCENARIOS: Scenario[] = [
  {
    id: 'vercel-breach',
    title: 'The Vercel-Firebase Security Breach',
    description: 'A major production environment has been compromised. Sam and Judah are looking for an immediate technical recovery and delivery strategy.',
    difficulty: 'Extreme',
    focus: 'Security & Recovery'
  },
  {
    id: 'eu-ai-act',
    title: 'EU AI Act Regulatory Compliance',
    description: 'We are deploying AI in Europe. The panel will grill you on Sovereign AI, data privacy, and regulatory guardrails.',
    difficulty: 'High',
    focus: 'Governance & Privacy'
  },
  {
    id: 'differential-qa',
    title: 'Differential QA Architecture Shift',
    description: 'Judah is skeptical of our new QA pipeline. Defend the move from manual capacity to an Agentic AI QA model.',
    difficulty: 'Critical',
    focus: 'Technical Architecture'
  },
  {
    id: 'agentic-commerce',
    title: 'Agentic Commerce Pivot',
    description: 'A client wants to allow AI Agents to make purchases autonomously. Sam wants to know the ROI; Judah wants to know the guts of the IoC.',
    difficulty: 'High',
    focus: 'Business Innovation'
  },
  {
    id: 'sovereign-cloud',
    title: 'Sovereign Cloud Migration',
    description: 'The client is moving away from Azure/AWS to a private VPS/Docker setup for data sovereignty. Defend the architectural security of this move.',
    difficulty: 'Critical',
    focus: 'Infrastructure & Privacy'
  },
  {
    id: 'ai-tat-optimization',
    title: 'Operational TAT Crisis',
    description: 'Delivery timelines are slipping. You must propose an AI-augmented workflow that reduces TAT by 70% without sacrificing quality.',
    difficulty: 'Extreme',
    focus: 'Delivery Excellence'
  },
  {
    id: 'linguistic-governance',
    title: 'The Linguistic Governance Gate',
    description: 'A global team is producing non-compliant technical documentation. Pivot your "Intel Save" strategy into a scalable Perficient solution.',
    difficulty: 'High',
    focus: 'Global Delivery'
  },
  {
    id: 'llm-cost-management',
    title: 'The GenAI Gateway Budget',
    description: 'Token costs are spiraling out of control. Defend your budget-tracking gateway architecture against a skeptical CFO-type stakeholder.',
    difficulty: 'Critical',
    focus: 'Financial ROI'
  },
  {
    id: 'agentic-refactoring',
    title: 'Legacy-to-Agentic Modernization',
    description: 'We have 10 years of manual QA tests. Propose a migration path to an Agentic AI model using LangGraph and self-healing cycles.',
    difficulty: 'High',
    focus: 'Digital Transformation'
  },
  {
    id: 'human-in-the-loop',
    title: 'Autonomy vs. Governance',
    description: 'The panel believes AI agents are too risky for production. Implement a "Human-in-the-Loop" architecture that satisfies the board.',
    difficulty: 'Extreme',
    focus: 'Ethical AI & Risk'
  }
];

export const MASTER_GLOSSARY: GlossaryItem[] = [
  // AI/ML - The Motor
  { term: 'LLM', definition: 'Large Language Model. Neural networks trained on massive datasets to predict the next token.', category: 'AI/ML' },
  { term: 'Transformer', definition: 'The architectural backbone of modern AI, utilizing "Attention" mechanisms to weigh the importance of different parts of input data.', category: 'AI/ML' },
  { term: 'Parameters', definition: 'The internal variables of a model that it learns during training. "70B" means 70 billion parameters.', category: 'AI/ML' },
  { term: 'Fine-Tuning', definition: 'The process of taking a pre-trained model and training it further on a smaller, specific dataset (SFT - Supervised Fine-Tuning).', category: 'AI/ML' },
  { term: 'RLHF', definition: 'Reinforcement Learning from Human Feedback. Aligning model behavior with human preferences.', category: 'AI/ML' },
  { term: 'LoRA / QLoRA', definition: 'Low-Rank Adaptation. A technique to fine-tune giant models by only changing a tiny fraction of weights, often using quantization (QLoRA) to save VRAM.', category: 'AI/ML' },
  { term: 'Inference', definition: 'The phase where a trained model is used to generate an output or prediction.', category: 'AI/ML' },
  { term: 'Context Window', definition: 'The maximum amount of information (tokens) a model can "remember" or process in a single turn.', category: 'AI/ML' },
  { term: 'Tokens', definition: 'The unit of text an AI processes. Roughly 0.75 words per token.', category: 'AI/ML' },
  { term: 'Embedding', definition: 'A numerical representation (vector) of a piece of data (text, image) that captures its semantic meaning.', category: 'AI/ML' },

  // QA/EVALS - The Guardrails
  { term: 'EVALS', definition: 'Automated benchmarks used to measure model performance across accuracy, safety, and reasoning.', category: 'QA/EVALS' },
  { term: 'Grounding', definition: 'Ensuring an AI\'s response is based on a specific, provided source of truth (e.g., your company\'s documentation).', category: 'QA/EVALS' },
  { term: 'Faithfulness', definition: 'A metric measuring if the AI\'s answer can be derived solely from the provided context without making things up.', category: 'QA/EVALS' },
  { term: 'Hallucination', definition: 'When an AI generates factually incorrect or nonsensical information with high confidence.', category: 'QA/EVALS' },
  { term: 'Red Teaming', definition: 'Proactive testing where humans or agents try to "break" the AI by inducing toxic, biased, or restricted outputs.', category: 'QA/EVALS' },
  { term: 'DeepEval / Ragas', definition: 'Frameworks for unit testing LLM outputs against specific metrics like relevancy and bias.', category: 'QA/EVALS' },
  { term: 'Guardrails', definition: 'Software layers (like NeMo Guardrails) that intercept AI input/output to enforce safety and topical boundaries.', category: 'QA/EVALS' },
  { term: 'Prompt Injection', definition: 'A security vulnerability where a user attempts to override the system instructions by providing clever inputs.', category: 'QA/EVALS' },

  // INFRA/TI - The Infrastructure
  { term: 'VPC', definition: 'Virtual Private Cloud. A private network in a public cloud (AWS/Azure) used to isolate AI workloads.', category: 'INFRA/TI' },
  { term: 'PrivateLink', definition: 'AWS technology that allows private connectivity between VPCs without data crossing the public internet.', category: 'INFRA/TI' },
  { term: 'VRAM', definition: 'Video RAM. The memory on a GPU where model weights are loaded. The primary bottleneck for AI performance.', category: 'INFRA/TI' },
  { term: 'H100 / A100', definition: 'Nvidia\'s enterprise-grade GPUs (Hopper / Ampere) designed for AI training and inference.', category: 'INFRA/TI' },
  { term: 'Quantization', definition: 'Reducing the precision of model weights (e.g., from 16-bit to 4-bit) to fit larger models on smaller GPUs.', category: 'INFRA/TI' },
  { term: 'vLLM', definition: 'A high-throughput inference engine for LLMs that uses PagedAttention to optimize memory.', category: 'INFRA/TI' },
  { term: 'Vector DB', definition: 'A database (like Pinecone or Chroma) optimized for storing and searching high-dimensional embeddings.', category: 'INFRA/TI' },
  { term: 'RAG', definition: 'Retrieval-Augmented Generation. Connecting an LLM to external data to reduce hallucinations.', category: 'INFRA/TI' },
  { term: 'Agentic Orchestration', definition: 'Using autonomous agents (via LangGraph or CrewAI) to perform sequences of tasks rather than a single chat response.', category: 'INFRA/TI' },
  { term: 'MLOps', definition: 'Machine Learning Operations. The practice of automating the deployment, monitoring, and management of ML models.', category: 'INFRA/TI' },

  // EXEC/BIZ - The ROI
  { term: 'ROI', definition: 'Return on Investment. For AI, often measured in "hours saved" or "error rate reduction."', category: 'EXEC/BIZ' },
  { term: 'TCO', definition: 'Total Cost of Ownership. Includes GPU rental, token costs, engineering salaries, and observability tools.', category: 'EXEC/BIZ' },
  { term: 'CAPEX / OPEX', definition: 'Capital Expenditure (buying servers) vs. Operating Expenditure (renting GPUs). Most AI projects are OPEX-heavy.', category: 'EXEC/BIZ' },
  { term: 'SOC2 / ISO 27001', definition: 'Security certifications required for enterprise SaaS. Essential for AI projects handling customer data.', category: 'EXEC/BIZ' },
  { term: 'SLA', definition: 'Service Level Agreement. A commitment to uptime or performance (e.g., 99.9% uptime).', category: 'EXEC/BIZ' },
  { term: 'Latency', definition: 'The time it takes for an AI to start responding (TTFT - Time To First Token).', category: 'EXEC/BIZ' },
  { term: 'Data Lineage', definition: 'Tracking the origin, movement, and transformation of data within an AI pipeline for audits.', category: 'EXEC/BIZ' },
  { term: 'Co-Pilot vs. Auto-Pilot', definition: 'Human-in-the-loop assistance (Co-Pilot) vs. Fully autonomous agentic execution (Auto-Pilot).', category: 'EXEC/BIZ' },
  { term: 'Tokenomics', definition: 'The economic model of token costs, throughput, and rate-limiting in an enterprise environment.', category: 'EXEC/BIZ' },
];
