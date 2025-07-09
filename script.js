document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica del Panel de Administración ---
    const adminToggleButton = document.getElementById('adminToggleButton');
    const adminPanel = document.getElementById('adminPanel');
    const closeAdminPanelBtn = document.getElementById('closeAdminPanelBtn');
    const applyChangesBtn = document.getElementById('applyChangesBtn');

    // Campos del formulario en el panel
    const heroTitleInput = document.getElementById('heroTitleInput');
    const heroSubtitleInput = document.getElementById('heroSubtitleInput');
    const heroBtn1TextInput = document.getElementById('heroBtn1TextInput');
    const heroBtn1LinkInput = document.getElementById('heroBtn1LinkInput');
    const heroBtn2TextInput = document.getElementById('heroBtn2TextInput');
    const heroBtn2LinkInput = document.getElementById('heroBtn2LinkInput');
    const logoUrlInput = document.getElementById('logoUrlInput');
    const faviconUrlInput = document.getElementById('faviconUrlInput');
    const heroBgUrlInput = document.getElementById('heroBgUrlInput');

    // Elementos HTML que se actualizarán
    const heroTitle = document.getElementById('heroTitle');
    const heroSubtitle = document.getElementById('heroSubtitle');
    const heroBtn1 = document.getElementById('heroBtn1');
    const heroBtn2 = document.getElementById('heroBtn2');
    const companyLogo = document.getElementById('companyLogo');
    const hero