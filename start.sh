echo "spinning up docker images for required services"
docker compose up -d

echo "\n\n";

echo "pulling required models (0/2)\n"
echo "pulling embed model (1/2)\n"
curl http://localhost:11434/api/pull -d '{"model":"nomic-embed-text"}'

echo "pulling chat model (2/2)\n"
curl http://localhost:11434/api/pull -d '{"model":"artifish/llama3.2-uncensored"}'

echo "\n\n";

echo "installing dora dependencies \n"
npm install

echo "\n\n";

npm link
echo "all done \n"