#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <map>
#include <set>
#include <queue>
#include <sstream>
using namespace std;
struct Job {
    string title;
    string company;
    vector<string> skills;
    string link;
};
string toLower(string s) {
    transform(s.begin(), s.end(), s.begin(), ::tolower);
    return s;
}
double matchScore(const vector<string>& jobSkills, const vector<string>& userSkills, vector<string>& missingSkills) {
    int matchCount = 0;
    for (auto& js : jobSkills) {
        bool found = false;
        for (auto& us : userSkills) {
            if (toLower(us) == toLower(js)) {
                found = true;
                break;
            }
        }
        if (found) matchCount++;
        else missingSkills.push_back(js);
    }
    return (double)matchCount / jobSkills.size() * 100.0;
}
struct Graph {
    map<string, vector<string>> adj;
    void addEdge(const string& u, const string& v) {
        adj[u].push_back(v);
        adj[v].push_back(u); 
    }
    // bfs
    vector<string> bfs(const vector<string>& startSkills) {
        queue<string> q;
        set<string> visited;
        vector<string> foundJobs;
        for (auto& skill : startSkills) {
            string s = toLower(skill);
            if (adj.count(s)) {
                q.push(s);
                visited.insert(s);
            }
        }
        while (!q.empty()) {
            string node = q.front();
            q.pop();
            for (auto& nei : adj[node]) {
                if (!visited.count(nei)) {
                    visited.insert(nei);
                    q.push(nei);
                    if (nei.rfind("job_", 0) == 0) {
                        foundJobs.push_back(nei);
                    }
                }
            }
        }
        return foundJobs;
    }
    //dfs
    void dfsUtil(const string& node, set<string>& visited, vector<string>& connectedJobs) {
        visited.insert(node);
        for (auto& nei : adj[node]) {
            if (!visited.count(nei)) {
                if (nei.rfind("job_", 0) == 0)
                    connectedJobs.push_back(nei);
                dfsUtil(nei, visited, connectedJobs);
            }
        }
    }
    vector<string> dfs(const vector<string>& startSkills) {
        set<string> visited;
        vector<string> jobs;
        for (auto& skill : startSkills) {
            string s = toLower(skill);
            if (adj.count(s) && !visited.count(s)) {
                dfsUtil(s, visited, jobs);
            }
        }
        return jobs;
    }
};
int main(int argc, char* argv[]) {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    if (argc < 2) {
        cout << "[]" << endl;
        return 0;
    }
    vector<string> userSkills;
    for (int i = 1; i < argc; ++i)
        userSkills.push_back(argv[i]);
    vector<Job> jobs = {
       {"Frontend Developer", "Amazon", {"HTML", "CSS", "JavaScript", "React"}, "https://www.amazon.jobs/en/"},
        {"Software Development Engineer", "Flipkart", {"Java", "Spring Boot", "SQL", "API Development"}, "https://www.flipkartcareers.com/"},
        {"Data Analyst", "Microsoft", {"Python", "Excel", "SQL", "Data Visualization"}, "https://careers.microsoft.com/"},
        {"UX Designer", "Google", {"Figma", "UI/UX", "Prototyping", "User Research"}, "https://careers.google.com/"},
        {"Backend Engineer", "Meesho", {"Node.js", "MongoDB", "API Development", "Cloud Services"}, "https://careers.meesho.com/"},
        {"Cloud Solutions Architect", "AWS", {"Cloud Computing", "AWS", "DevOps", "Infrastructure"}, "https://www.amazon.jobs/en/teams/aws"},
        {"Content Strategist", "Netflix", {"Content Strategy", "Digital Marketing", "Analytics", "SEO"}, "https://jobs.netflix.com/"},
        {"Business Analyst", "Deloitte", {"Business Analysis", "Data Analysis", "SQL", "Project Management"}, "https://www2.deloitte.com/global/en/careers.html"}
     };
    //Graph creation 
    Graph g;
     for (auto& job : jobs) {
        string jobNode = "job_" + toLower(job.company);
        for (auto& skill : job.skills)
            g.addEdge(jobNode, toLower(skill));
    }
    vector<string> bfsJobs = g.bfs(userSkills);
    vector<string> dfsJobs = g.dfs(userSkills);
    set<string> allJobs(bfsJobs.begin(), bfsJobs.end());
    allJobs.insert(dfsJobs.begin(), dfsJobs.end());
    
    stringstream json;
    json << "[";
    bool first = true;
    for (auto& job : jobs) {
        string jobNode = "job_" + toLower(job.company);
        if (allJobs.count(jobNode)) {
            vector<string> missing;
            double score = matchScore(job.skills, userSkills, missing);
            if (score > 0) {
                if (!first) json << ",";
                first = false;
                json << "{";
                json << "\"title\":\"" << job.title << "\",";
                json << "\"company\":\"" << job.company << "\",";
                json << "\"link\":\"" << job.link << "\",";
                json << "\"matchScore\":" << (int)score << ",";
                json << "\"skills\":[";
                for (size_t i = 0; i < job.skills.size(); ++i) {
                    if (i) json << ",";
                    json << "\"" << job.skills[i] << "\"";
                }
                json << "],\"missingSkills\":[";
                for (size_t i = 0; i < missing.size(); ++i) {
                    if (i) json << ",";
                    json << "\"" << missing[i] << "\"";
                }
                json << "]}";
            }
        }
    }
    json << "]";
    cout << json.str() << endl;
    return 0;
}