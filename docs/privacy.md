# Privacy

Group Theory Visualizer does not collect analytics in v1.

The app stores small preferences in the browser through `localStorage`, such as the selected group, graph style, and optional local LLM endpoint.

The optional LLM panel sends prompts only to the endpoint entered by the user, for example `http://localhost:11434/api/generate`. No hosted service is contacted by default.

Repository metadata, such as the latest commit, is fetched from the public GitHub API:

https://api.github.com/repos/baditaflorin/group-theory-visualizer/commits/main
