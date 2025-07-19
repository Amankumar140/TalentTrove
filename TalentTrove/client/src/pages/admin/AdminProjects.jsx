import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [displayProjects, setDisplayProjects] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    await axios
      .get(
        `${import.meta.env.VITE_API_BASE_URL}
/fetch-projects`
      )
      .then((response) => {
        setProjects(response.data);
        setDisplayProjects(response.data.reverse());

        let skillsSet = new Set();
        response.data.forEach((project) => {
          project.skills.forEach((skill) => skillsSet.add(skill));
        });
        setAllSkills([...skillsSet]);
      })
      .catch((err) => console.log(err));
  };

  const handleCategoryCheckBox = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setCategoryFilter([...categoryFilter, value]);
    } else {
      setCategoryFilter(categoryFilter.filter((skill) => skill !== value));
    }
  };

  useEffect(() => {
    if (categoryFilter.length > 0) {
      setDisplayProjects(
        projects
          .filter((project) =>
            categoryFilter.every((skill) => project.skills.includes(skill))
          )
          .reverse()
      );
    } else {
      setDisplayProjects(projects.reverse());
    }
  }, [categoryFilter]);

  return (
    <div className="bg-[#101214] text-white min-h-screen p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#2e3434] p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-blue-400">Filters</h3>
          <hr className="my-2 border-gray-700" />
          <h5 className="text-md font-medium text-white">Skills</h5>
          {allSkills.length > 0 && (
            <div className="mt-2 space-y-2">
              {allSkills.map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={skill}
                    onChange={handleCategoryCheckBox}
                    className="form-checkbox text-blue-500"
                  />
                  <label className="text-white">{skill}</label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-2">
          <h3 className="text-lg font-semibold text-blue-300">All Projects</h3>
          <hr className="my-2 border-gray-700" />
          <div className="grid gap-4">
            {displayProjects.map((project) => (
              <div
                key={project._id}
                className="bg-[#2e3434] p-6 rounded-2xl shadow-lg"
              >
                <div className="flex justify-between">
                  <h3 className="text-xl font-bold text-white">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-400">{project.postedDate}</p>
                </div>
                <h5 className="text-md font-medium text-blue-300">
                  Budget: $ {project.budget}
                </h5>
                <h5 className="text-md font-medium text-white">
                  Client: {project.clientName} ({project.clientEmail})
                </h5>
                <p className="text-gray-300 mt-2">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-blue-200 text-black px-3 py-1 rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex justify-between">
                  <p className="text-gray-400">{project.bids.length} bids</p>
                  <h6 className="text-blue-400 font-medium">
                    Avg Bid: ₹{" "}
                    {project.bids.length > 0
                      ? project.bidAmounts.reduce(
                          (acc, curr) => acc + curr,
                          0
                        ) / project.bids.length
                      : 0}
                  </h6>
                </div>
                <h5 className="text-md font-medium text-yellow-300">
                  Status: {project.status}
                </h5>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProjects;
