# Donna Research

An AI-powered legal case discovery platform that combines semantic search with intelligent agents to revolutionize legal research workflows.

## Overview

Donna Research streamlines the legal research process by leveraging advanced AI techniques to automate case discovery and analysis. Built for law clerks, associates, and legal researchers, the platform combines traditional search methods with AI-driven analysis to quickly identify relevant precedents and form robust legal strategies.

## Key Features

- **Enhanced Semantic Search**
  - Natural language query processing with automatic enhancement
  - Context-aware search understanding
  - Direct integration with major legal databases (Case Base, Westlaw) (coming soon)

- **Intelligent Case Discovery**
  - Hybrid search combining BM25 and vector embeddings
  - Domain-specific legal reranking system
  - Citation network analysis
  - Automated relevance scoring using Elo rating system

## Technical Architecture

- Built with Next.js
- Dual-path search architecture:
  - Primary Path: BM25 + domain-specific reranking
  - Parallel AI Agent Path: Autonomous exploration and novel connection discovery (coming soon)



### Installation

```bash
# Clone the repository


# Install dependencies
pnpm install
pnpm dev

# Configure API keys
cp .env.example .env
# Add your API keys to .env
```


