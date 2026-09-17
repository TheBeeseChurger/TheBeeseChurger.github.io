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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`;

async function loadAllProjects() {
    if (!listContainer) return;

    try {
        const response = await fetch('./data/data.json');
        if (!response.ok) throw new Error(`Failed to fetch projects data: ${response.statusText}`);
        const data = await response.json();
        projects = data;

        // TODO: Build filters and render projects list here
        buildTypeFilters();
        buildTagFilters();
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
            // TODO: Render Projects list here
        })
    })
}

function buildTagFilters() {
    const uniqueTags = new Set();
    projects.forEach(project => project.tags.forEach(tag => uniqueTags.add(tag)));

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
            // TODO: Render Projects list here
        })
    });
}

function getFilteredProjects() {
    return projects.filter(project => {
        const matchesTags = activeTags.has('All') || project.tags.every(tag => activeTags.has(tag));

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
        listContainer.innerHTML = '<p class="no-results">Not finding what you\'re looking for here! Try another search with a different search or some different filters.</p>';
        return;
    }
}

loadAllProjects();