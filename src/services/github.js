import GitHub from 'github-api';

class GitHubService {
  constructor(oauthKey) {
    this._github = new GitHub({
      token: oauthKey,
    });
  }

  getRepos() {
    return this._github.getUser().listRepos();
  }

  getIssues(repo) {
    const issues = this._github.getIssues(repo.full_name);
    return issues.listIssues();
  }
}

export default GitHubService;