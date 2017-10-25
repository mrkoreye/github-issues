import GitHub from 'github-api';

class GitHubService {
  constructor() {
    this._github = new GitHub({
      token: '67b40624ceff6ac0b8f62e8948b76508eed7f903'
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