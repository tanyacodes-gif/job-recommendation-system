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
        {"Frontend Developer", "Amazon", {"html", "css", "javascript", "react"}, "https://www.amazon.jobs/"},
        {"Software Development Engineer", "Flipkart", {"java", "sql", "data structures", "git"}, "https://www.flipkartcareers.com/"},
        {"Data Analyst", "Microsoft", {"python", "excel", "sql", "machine learning"}, "https://careers.microsoft.com/"},
        {"UX/UI Designer", "Google", {"figma", "communication", "html", "css"}, "https://careers.google.com/"},
        {"Backend Developer", "Meesho", {"node.js", "mongodb", "javascript", "git"}, "https://www.meesho.io/jobs"},
        {"Cloud / AWS Associate", "AWS", {"aws", "python", "git", "communication"}, "https://www.amazon.jobs/content/en/teams/amazon-web-services"},
        {"Business Intelligence Analyst", "Deloitte", {"excel", "sql", "python", "communication"}, "https://www.deloitte.com/global/en/careers.html"},
        {"Software Engineer", "Adobe", {"java", "c++", "data structures", "git"}, "https://careers.adobe.com/"},
        {"Associate Software Engineer", "IBM", {"python", "java", "sql", "communication"}, "https://www.ibm.com/careers"},
        {"Full Stack Developer", "Wipro", {"html", "css", "javascript", "node.js"}, "https://careers.wipro.com/"},
        {"Graduate Engineer Trainee", "Infosys", {"java", "python", "sql", "data structures"}, "https://www.infosys.com/careers/"},
        {"Technology Analyst", "TCS", {"java", "sql", "git", "communication"}, "https://www.tcs.com/careers"},
        {"Product / Data Analyst", "Swiggy", {"sql", "excel", "python", "communication"}, "https://careers.swiggy.com/"},
        {"Software Development Engineer", "Zomato", {"javascript", "python", "data structures", "git"}, "https://www.zomato.com/careers"},
        {"Data / AI Intern", "NVIDIA", {"python", "machine learning", "c++", "data structures"}, "https://www.nvidia.com/en-us/about-nvidia/careers/"},
        {"Cloud Support Associate", "Oracle", {"aws", "sql", "python", "communication"}, "https://www.oracle.com/careers/"},
        {"Software Engineer", "Accenture", {"java", "python", "sql", "communication"}, "https://www.accenture.com/in-en/careers"},
        {"Frontend Engineer", "Atlassian", {"html", "css", "javascript", "react"}, "https://www.atlassian.com/company/careers"},
        {"Software Engineer", "Paytm", {"java", "sql", "data structures", "git"}, "https://paytm.com/careers/"},
        {"Product Design Intern", "Canva", {"figma", "communication", "html", "css"}, "https://www.canva.com/careers/"},
        {"Data Analyst", "Uber", {"python", "sql", "excel", "machine learning"}, "https://www.uber.com/us/en/careers/"},
        {"Software Engineer", "Cisco", {"python", "c++", "data structures", "communication"}, "https://jobs.cisco.com/"},
        {"Application Developer", "Capgemini", {"java", "sql", "git", "communication"}, "https://www.capgemini.com/careers/"},
        {"Software Engineer", "Intuit", {"javascript", "react", "sql", "git"}, "https://careers.intuit.com/"}
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