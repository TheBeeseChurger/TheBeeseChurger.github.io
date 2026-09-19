// Globals & Constants

let projects = [];
let activeTags = new Set(['All']);
let activeType = 'All';
let searchQuery = '';

const listContainer = document.getElementById('projectsList');
const searchInput = document.getElementById('searchInput');
const typeFilterContainer = document.getElementById('typeFilterContainer');
const tagFilterContainer = document.getElementById('tagFilterContainer');
const resultsCount = document.getElementById('resultsCount');

const professionalBadgeSvg = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
    </svg>
`;

async function loadAllProjects() {
    if (!listContainer) return;

    try {
        const response = await fetch('./data/data.json');
        if (!response.ok) throw new Error(`Failed to fetch projects data: ${response.statusText}`);
        const data = await response.json();
        projects = data;

        buildTypeFilters();
        buildTagFilters();
        renderProjectsList();
    } catch (error) {
        console.error('Error loading projects:', error);
        listContainer.innerHTML = '<p class="no-results">Failed to load projects. Please try again later.</p>';
    }
}

function buildTypeFilters() {
    const types = ['All', 'Professional', 'Personal'];

    typeFilterContainer.innerHTML = types.map(type => `
        <div class="filter-tag ${activeType === type ? 'active' : ''}" data-type="${type}">${type}</div>
    `).join('');

    typeFilterContainer.querySelectorAll('.filter-tag').forEach(el => {
        el.addEventListener('click', () => {
            activeType = el.getAttribute('data-type');
            typeFilterContainer.querySelectorAll('.filter-tag').forEach(tag => tag.classList.remove('active'));
            el.classList.add('active');
            renderProjectsList();
        })
    })
}

function buildTagFilters() {
    const uniqueTags = new Set();
    projects.filter(project => {return !project.disabled;}).forEach(project => project.tags.forEach(tag => uniqueTags.add(tag)));

    const tags = ['All', ...Array.from(uniqueTags).sort()];

    tagFilterContainer.innerHTML = tags.map(tag => `
        <div class="filter-tag ${activeTags.has(tag) ? 'active' : ''}" data-tag="${tag}">${tag}</div>
    `).join('');

    tagFilterContainer.querySelectorAll('.filter-tag').forEach(el => {
        el.addEventListener('click', () => {
            // Toggle tag in activeTags Set
            const tag = el.getAttribute('data-tag');
            if (tag === 'All') activeTags = new Set(['All']);
            else {
                if (activeTags.has(tag)) activeTags.delete(tag);
                else {
                    activeTags.add(tag);
                    if (activeTags.has('All')) activeTags.delete('All');
                }
                if (activeTags.size === 0) activeTags.add('All');
            }

            // Update active class on tags
            tagFilterContainer.querySelectorAll('.filter-tag').forEach(tagEl => {
                tagEl.classList.remove('active');
                if (activeTags.has(tagEl.getAttribute('data-tag'))) {
                    tagEl.classList.add('active');
                }
            });
            renderProjectsList();
        })
    });
}

function getFilteredProjects() {
    return projects.filter(project => {
        if (project.disabled) return false;

        const matchesTags = activeTags.has('All') || [...activeTags].every(tag => project.tags.includes(tag));

        const matchesType = 
            activeType === 'All' ||
            (activeType === 'Professional' && project.professional) ||
            (activeType === 'Personal' && !project.professional);

        const query = searchQuery.trim().toLowerCase();
        const matchesSearch = query === '' ||
            project.title.toLowerCase().includes(query) ||
            project.description.toLowerCase().includes(query);
        
        return matchesTags && matchesType && matchesSearch;
    });
}

function renderProjectsList() {
    const filteredProjects = getFilteredProjects();

    resultsCount.textContent = `${filteredProjects.length} project${filteredProjects.length !== 1 ? 's' : ''} found`;

    if (filteredProjects.length === 0) {
        listContainer.innerHTML = '<p class="no-results">Not finding what you\'re looking for here! Try another search with a different search or different filters.</p>';
        return;
    }

    listContainer.innerHTML = filteredProjects.map(project => `
        <a href="${project.page_link}" class="project-list-card">
            <div class="project-list-banner">
                ${project.list_banner
                    ? `<img src="${project.list_banner}" alt="${project.title} banner" onerror="this.parentElement.innerHTML='<div class=\\'project-list-banner-placeholder\\'>No banner image yet</div>'">`
                    : `<div class="project-list-banner-placeholder">No banner image yet</div>`
                }
            </div>
            <div class="project-list-content">
                <div class="project-list-header">
                    <h3>${project.title}</h3>
                    ${project.professional ? `<span class="professional-badge">${professionalBadgeSvg}Professional</span>` : ''}
                </div>
                <p class="project-list-desc">${project.description}</p>
                <div class="project-list-tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        </a>
    `).join('');
}

searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderProjectsList();
});

loadAllProjects();