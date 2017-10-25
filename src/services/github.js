import GitHub from 'github-api';

class GitHubService {
  constructor(oauthKey) {
    this._github = new GitHub({
      token: oauthKey,
    });
    this.currentUser = this._github.getUser();
  }

  getRepos() {
    return this.currentUser.listRepos();
  }

  getIssues(repo) {
    const issues = this._github.getIssues(repo.full_name);
    return issues.listIssues();
  }
}

export default GitHubService;