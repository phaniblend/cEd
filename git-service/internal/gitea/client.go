package gitea

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

type Client struct {
	BaseURL string
	Token   string
	Client  *http.Client
}

type Repository struct {
	ID          int64  `json:"id"`
	Name        string `json:"name"`
	FullName    string `json:"full_name"`
	Description string `json:"description"`
	Private     bool   `json:"private"`
	HTMLURL     string `json:"html_url"`
	CloneURL    string `json:"clone_url"`
}

type Branch struct {
	Name   string `json:"name"`
	Commit struct {
		ID      string `json:"id"`
		Message string `json:"message"`
	} `json:"commit"`
}

type Commit struct {
	ID      string `json:"id"`
	Message string `json:"message"`
	Author  struct {
		Name  string `json:"name"`
		Email string `json:"email"`
		Date  string `json:"date"`
	} `json:"author"`
}

type PullRequest struct {
	ID     int64  `json:"id"`
	Number int64  `json:"number"`
	Title  string `json:"title"`
	Body   string `json:"body"`
	State  string `json:"state"`
	Base   struct {
		Ref string `json:"ref"`
	} `json:"base"`
	Head struct {
		Ref string `json:"ref"`
	} `json:"head"`
}

func NewClient() *Client {
	baseURL := os.Getenv("GITEA_URL")
	if baseURL == "" {
		baseURL = "http://localhost:3000"
	}
	token := os.Getenv("GITEA_TOKEN")
	if token == "" {
		token = "your-gitea-token"
	}

	return &Client{
		BaseURL: baseURL,
		Token:   token,
		Client:  &http.Client{},
	}
}

func (c *Client) makeRequest(method, endpoint string, body interface{}) (*http.Response, error) {
	url := fmt.Sprintf("%s/api/v1%s", c.BaseURL, endpoint)

	var reqBody io.Reader
	if body != nil {
		jsonData, err := json.Marshal(body)
		if err != nil {
			return nil, err
		}
		reqBody = bytes.NewBuffer(jsonData)
	}

	req, err := http.NewRequest(method, url, reqBody)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", fmt.Sprintf("token %s", c.Token))
	req.Header.Set("Content-Type", "application/json")

	return c.Client.Do(req)
}

// CreateRepository creates a new repository in Gitea
func (c *Client) CreateRepository(owner, name string, private bool) (*Repository, error) {
	payload := map[string]interface{}{
		"name":    name,
		"private": private,
	}

	resp, err := c.makeRequest("POST", fmt.Sprintf("/user/repos"), payload)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("failed to create repository: %s", string(body))
	}

	var repo Repository
	if err := json.NewDecoder(resp.Body).Decode(&repo); err != nil {
		return nil, err
	}

	return &repo, nil
}

// GetRepository retrieves repository information
func (c *Client) GetRepository(owner, name string) (*Repository, error) {
	resp, err := c.makeRequest("GET", fmt.Sprintf("/repos/%s/%s", owner, name), nil)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("repository not found")
	}

	var repo Repository
	if err := json.NewDecoder(resp.Body).Decode(&repo); err != nil {
		return nil, err
	}

	return &repo, nil
}

// ListBranches lists all branches for a repository
func (c *Client) ListBranches(owner, name string) ([]Branch, error) {
	resp, err := c.makeRequest("GET", fmt.Sprintf("/repos/%s/%s/branches", owner, name), nil)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to list branches")
	}

	var branches []Branch
	if err := json.NewDecoder(resp.Body).Decode(&branches); err != nil {
		return nil, err
	}

	return branches, nil
}

// CreatePullRequest creates a new pull request
func (c *Client) CreatePullRequest(owner, repo, title, body, base, head string) (*PullRequest, error) {
	payload := map[string]string{
		"title": title,
		"body":  body,
		"base":  base,
		"head":  head,
	}

	resp, err := c.makeRequest("POST", fmt.Sprintf("/repos/%s/%s/pulls", owner, repo), payload)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("failed to create pull request: %s", string(body))
	}

	var pr PullRequest
	if err := json.NewDecoder(resp.Body).Decode(&pr); err != nil {
		return nil, err
	}

	return &pr, nil
}

