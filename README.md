# dora-cli

```
  ____     ___    ____       _    
 |  _ \   / _ \  |  _ \     / \   
 | | | | | | | | | |_) |   / _ \  
 | |_| | | |_| | |  _ <   / ___ \ 
 |____/   \___/  |_| \_\ /_/   \_\
```

A command line version (CLI) version of [Dora](https://github.com/space0blaster/dora).
Dora is a locally running CLI tool that crawls and embeds your local directories so you can use semantic search to find files even if they're buried deep.

## Table of Contents
1. Requirements
2. Installation
3. Usage
4. Commands
5. FAQs

---

## Requirements
Dora requires Ollama and ChromDB.

### Ollama
Dora runs locally and uses Ollama for inference and embedding.
If you have Ollama running locally, you can skip the `Setup Services` sub-section under the `Installation` section.
If your Ollama instance is running on a different machine in your network, simply use `dora config --ollama-host=<network-host>` to point Dora to that network hosted Ollama instance. You can change the default port similarly: see the `config` command.
The version provided in this repo uses the Docker version.

### Chroma
Dora also saves your embeddings locally in the ChromaDB vector database.
If you have ChromaDB running locally, you can skip the `Setup Services` sub-section under the `Installation` section.
If your ChromaDB instance is running on a different machine in your network, simply use `dora config --ollama-host=<network-host>` to point Dora to that network hosted ChromDB instance. You can change the default port similarly: see the `config` command.
The version provided in this repo uses the Docker version.


## Installation

### Pull Repo
```bash
git clone https://github.com/space0blaster/dora-cli.git
cd dora-cli
```

### Run install.sh Script
Run the `install.sh` script to run Docker images, install node dependencies  and link the `dora` command.
```bash
sh install.sh
```

Alternatively, you can run the commands manually and/or skip the Docker step if you have Ollama and ChromaDB installed already.
See below for manual install.

### Setup Services
Similar to the [desktop version](https://github.com/space0blaster/dora), I have provided a Docker `compose.yaml` file
for the required services (it's the same yaml file). If you're not familiar with Docker, you can download it [here](https://docker.com).

To run the `compose.yaml` file, simply run the following command:
```bash
docker compose up -d
```
You should have Ollama and ChromaDB running at ports 11434 and 8000 respectively.

### Install Dependencies
Install Dora dependencies. The following command will pull and install them for you.
```bash
npm install
```

### Link Command
The last step is to link the `dora` command so you can use the cli from outside the install/dev directory.
```bash
npm link
```

You should be good to go, give it a try by running `dora about` or `dora --help` on your terminal.


---


## Usage

To save you memory and CPU utilization, Dora doesn't automatically start crawling and embedding all your directories.
To get started, pick a directory with files and folders and run the `crawl` command:
```bash
dora crawl "/path/to/your/directory"
```
```bash
/path/to/your/directory
✔ done indexing
    310 object paths indexed
✔ done embedding
    310 object paths embedded
46.74 seconds
```

Once it has finished crawling and embedding, you can run the `find` command:
```bash
dora find "all docs related to taxes"
```
```bash
all docs related to taxes
✔ done searching

found some files:
  [*] /path/to/your/directory/filing_confirmation.png
  [*] /path/to/your/directory/1040a.pdf
48.328 seconds
```

---


## Commands

### crawl
Crawl a target directory recursively.
`dora crawl <path>`

### find
Find any file or directory semantically.
```bash
dora find <query> [options]
```

Example:
```bash
dora find "all tax related documents" --auto-open true
```

Options:

| Option        |  Type   | Description                             |
|:--------------|:-------:|:----------------------------------------|
| --auto-open   |  bool   | Override program `--auto-open` config   |

### history
Print out prompt/query history.
```bash
dora history [options]
```

Example:
```bash
dora history --limit 10
```

Options:

| Option | Type | Description            |
| :-- | :--: |:-----------------------|
| --limit | bool | Limit returned results |

### recent
Print out recent `find` results.
```bash
dora recent [options]
```

Example:
```bash
dora recent --limit 5
```

Options:

| Option | Type | Description            |
| :-- | :--: |:-----------------------|
| --limit | bool | Limit returned results |

### config
Configure Dora base configurations.
```bash
dora config [options]
```

Example:
```bash
dora config --ollama-host 192.168.0.1
```

Options:

| Option        |            Default            |  Type  | Description                                                                                       |
|:--------------|:-----------------------------:|:------:|:--------------------------------------------------------------------------------------------------|
| --ollama-host |           127.0.0.1           | string | The hostname or IP that points to the Ollama server                                               |
| --ollama-port |             11434             |  int   | The port being used by the Ollama server                                                          |
| --chroma-host |           127.0.0.1           | string | The histname or IP address that points to the ChromaDB server                                     |
| --chroma-port |             8000              |  int   | The point being used by the ChromaDB server                                                       |
| --chat-model  | artifish/llama3.2-uncensored  | string | The LLM used by the `find` command to run your prompt                                             |
| --embed-model |       nomic-embed-text        | string | The LLM used to embed your file paths by the `crawl` command and prompt by the `find` command     |  
| --auto-open   |             true              |  bool  | Allow Dora to automatically open results from the `find` command using their default applications |

### about
Metadata about Dora.
```bash
dora about
```

---

## FAQs

Does Dora embed file contents?
* No but it's in the roadmap for release asap.

Does Dora send my directory details to the cloud?
* No, it's completely local.

Can I use a model of my choosing?
* Yes, you can change the chat model using `dora config --chat-model <my-prefered-model>` as long as the model is installed.

Can I use a different embedding model?
* Yes, you can change the default embed model using `dora config --embed-model <my-prefered-model>`.

Can I index/crawl my entire file system>
* Yes you can. As long as you have the memory for it.

Why do you use `artifish/llama3.2-uncensored` as the chat model?
* I have found that using uncensored models significantly reduces bad prompt responses since other models think you're asking for private files that don't belong to you.