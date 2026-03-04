class OeuvresModal {
  constructor() {
    this.modal = document.getElementById('oeuvres-modal');
    // Sélectionner uniquement le trigger DESKTOP (dans header__inline-menu)
    this.trigger = document.querySelector('.header__inline-menu .oeuvres-modal-trigger');
    this.closeButton = this.modal?.querySelector('.oeuvres-modal__close');
    // L'overlay est maintenant en dehors du modal
    this.overlay = document.getElementById('oeuvres-modal-overlay');
    
    if (!this.modal) {
      console.warn('OeuvresModal: Modal element not found');
      return;
    }
    
    if (!this.trigger) {
      // Pas de warning car le trigger desktop peut ne pas exister sur mobile
      return;
    }
    
    this.init();
  }
  
  init() {
    // Empêcher toute navigation - utiliser capture phase avec priorité maximale
    const handleClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      this.open();
      return false;
    };
    
    // Ajouter plusieurs gestionnaires pour être sûr
    this.trigger.addEventListener('click', handleClick, true); // Capture phase
    this.trigger.addEventListener('click', handleClick, false); // Bubble phase
    
    // Empêcher aussi les autres événements
    this.trigger.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
    }, true);
    
    // Fermer la modal
    if (this.closeButton) {
      this.closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.close();
      });
    }
    
    // Empêcher la propagation du clic depuis le contenu vers l'overlay
    const modalContent = this.modal?.querySelector('.oeuvres-modal__content');
    if (modalContent) {
      modalContent.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
    
    // Gestionnaire direct sur l'overlay - méthode la plus simple et fiable
    if (this.overlay) {
      this.overlay.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.close();
      }, true); // Utiliser capture phase pour être sûr
    }
    
    // Gestionnaire sur la modal elle-même en backup pour détecter les clics en dehors du contenu
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        const content = this.modal.querySelector('.oeuvres-modal__content');
        // Si le clic est sur la modal mais pas sur le contenu, fermer
        if (content && !content.contains(e.target) && e.target !== content) {
          if (e.target === this.modal) {
            e.stopPropagation();
            this.close();
          }
        }
      });
    }
    
    // Fermer avec la touche Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
    });
  }
  
  open() {
    this.modal.classList.add('active');
    // Activer aussi l'overlay séparé
    if (this.overlay) {
      this.overlay.classList.add('active');
    }
    document.body.classList.add('oeuvres-modal-open');
    // Bloquer le scroll de la page
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    // Sauvegarder la position du scroll pour la restaurer à la fermeture
    this.scrollY = window.scrollY;
    // Empêcher le scroll sur mobile
    document.documentElement.classList.add('modal-open');
  }
  
  close() {
    this.modal.classList.remove('active');
    // Désactiver aussi l'overlay séparé
    if (this.overlay) {
      this.overlay.classList.remove('active');
    }
    document.body.classList.remove('oeuvres-modal-open');
    // Restaurer le scroll de la page
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    // Restaurer la position du scroll
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    if (this.scrollY !== undefined) {
      window.scrollTo(0, this.scrollY);
    }
  }
}

// Fonction pour fermer la modal
function closeOeuvresModal() {
  const modal = document.getElementById('oeuvres-modal');
  const overlay = document.getElementById('oeuvres-modal-overlay');
  if (modal && modal.classList.contains('active')) {
    modal.classList.remove('active');
    // Désactiver aussi l'overlay séparé
    if (overlay) {
      overlay.classList.remove('active');
    }
    document.body.classList.remove('oeuvres-modal-open');
    // Restaurer le scroll de la page
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    // Restaurer la position du scroll
    const scrollY = parseInt(document.body.style.top || '0') * -1;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    if (scrollY) {
      window.scrollTo(0, scrollY);
    }
  }
}

// Intercepter TOUS les clics sur le bouton DESKTOP et empêcher toute navigation
document.addEventListener('click', function(e) {
  const trigger = e.target.closest('.oeuvres-modal-trigger');
  
  // Vérifier si c'est un trigger DESKTOP (dans header__inline-menu)
  if (trigger && trigger.closest('.header__inline-menu')) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    
    // Ouvrir la modal
    const modal = document.getElementById('oeuvres-modal');
    const overlay = document.getElementById('oeuvres-modal-overlay');
    if (modal) {
      modal.classList.add('active');
      // Activer aussi l'overlay séparé
      if (overlay) {
        overlay.classList.add('active');
      }
      document.body.classList.add('oeuvres-modal-open');
      // Bloquer le scroll de la page
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      // Sauvegarder la position du scroll
      const scrollY = window.scrollY;
      // Empêcher le scroll sur mobile
      document.documentElement.classList.add('modal-open');
    }
    
    return false;
  }
  
  // Fermer la modal si on clique sur l'overlay séparé
  const overlay = document.getElementById('oeuvres-modal-overlay');
  if (overlay && e.target === overlay) {
    e.preventDefault();
    e.stopPropagation();
    closeOeuvresModal();
    return;
  }
  
  // Fermer la modal si on clique en dehors du contenu
  const modal = document.getElementById('oeuvres-modal');
  if (modal && modal.classList.contains('active')) {
    const content = modal.querySelector('.oeuvres-modal__content');
    
    // Vérifier si le clic est sur la modal mais pas sur le contenu
    const isModalButNotContent = e.target.closest('#oeuvres-modal') === modal && 
                                  content && 
                                  !content.contains(e.target) && 
                                  e.target !== content;
    
    // Fermer si on clique sur la modal mais pas sur le contenu
    if (isModalButNotContent) {
      e.preventDefault();
      e.stopPropagation();
      closeOeuvresModal();
    }
  }
}, true); // Utiliser capture phase pour intercepter AVANT tout autre script

// Initialiser la modal immédiatement et aussi après le chargement
function initOeuvresModal() {
  // Vérifier plusieurs fois pour être sûr que le DOM est prêt
  const tryInit = () => {
    const trigger = document.querySelector('.oeuvres-modal-trigger');
    if (trigger) {
      // S'assurer qu'il n'y a pas d'attribut href ou de parent <a>
      trigger.removeAttribute('href');
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('tabindex', '0');
      
      // Empêcher toute navigation sur le parent aussi
      const parent = trigger.closest('li');
      if (parent) {
        // Empêcher toute navigation depuis le parent
        parent.addEventListener('click', (e) => {
          if (e.target.closest('.oeuvres-modal-trigger') || e.target === trigger) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
          }
        }, true);
        
        // Empêcher aussi les événements mousedown
        parent.addEventListener('mousedown', (e) => {
          if (e.target.closest('.oeuvres-modal-trigger') || e.target === trigger) {
            e.preventDefault();
            e.stopPropagation();
          }
        }, true);
      }
      
      // Initialiser la modal
      new OeuvresModal();
      return true;
    }
    return false;
  };
  
  // Essayer immédiatement
  if (!tryInit()) {
    // Si ça ne marche pas, attendre un peu
    setTimeout(() => {
      if (!tryInit()) {
        // Dernier essai après un délai plus long
        setTimeout(tryInit, 500);
      }
    }, 100);
  }
}

// Initialiser dès que possible
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initOeuvresModal);
} else {
  initOeuvresModal();
}

// Réinitialiser si Shopify recharge la section
document.addEventListener('shopify:section:load', initOeuvresModal);

// Gestionnaire global pour fermer la modal en cliquant sur l'overlay
// Utiliser mousedown pour être sûr de capturer l'événement
document.addEventListener('mousedown', function(e) {
  const modal = document.getElementById('oeuvres-modal');
  const overlay = document.getElementById('oeuvres-modal-overlay');
  
  // Si on clique directement sur l'overlay séparé
  if (overlay && e.target === overlay) {
    e.preventDefault();
    e.stopPropagation();
    closeOeuvresModal();
    return;
  }
  
  if (modal && modal.classList.contains('active')) {
    const content = modal.querySelector('.oeuvres-modal__content');
    
    // Si on clique sur la modal mais pas sur le contenu
    if (e.target.closest('#oeuvres-modal') === modal && content && !content.contains(e.target)) {
      e.preventDefault();
      e.stopPropagation();
      closeOeuvresModal();
    }
  }
}, true);

// ============================================
// SOUS-MENU MOBILE "LES OEUVRES"
// Utilise la délégation d'événements pour fonctionner
// même quand le menu drawer n'est pas encore ouvert
// ============================================

function openOeuvresSubmenu() {
  const submenu = document.getElementById('oeuvres-submenu');
  const trigger = document.querySelector('.oeuvres-submenu-trigger');
  if (submenu) {
    submenu.classList.add('oeuvres-submenu--open');
    document.body.style.overflow = 'hidden';
  }
  if (trigger) {
    trigger.setAttribute('aria-expanded', 'true');
  }
}

function closeOeuvresSubmenu() {
  const submenu = document.getElementById('oeuvres-submenu');
  const trigger = document.querySelector('.oeuvres-submenu-trigger');
  if (submenu) {
    submenu.classList.remove('oeuvres-submenu--open');
  }
  if (trigger) {
    trigger.setAttribute('aria-expanded', 'false');
  }
}

// Gestionnaire principal pour le sous-menu mobile
document.addEventListener('click', function(e) {
  // Ouvrir le sous-menu quand on clique sur le trigger
  const trigger = e.target.closest('.oeuvres-submenu-trigger');
  if (trigger) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    openOeuvresSubmenu();
    return false;
  }
  
  // Fermer le sous-menu quand on clique sur le bouton retour
  const backButton = e.target.closest('.oeuvres-submenu__back');
  if (backButton) {
    e.preventDefault();
    e.stopPropagation();
    closeOeuvresSubmenu();
    return;
  }
  
  // Fermer le sous-menu quand on clique sur un lien du sous-menu
  const submenuLink = e.target.closest('.oeuvres-submenu__link');
  if (submenuLink) {
    closeOeuvresSubmenu();
    return;
  }
  
  // Fermer le sous-menu quand on ferme le menu drawer
  const menuDrawerClose = e.target.closest('summary.header__icon--menu');
  if (menuDrawerClose) {
    closeOeuvresSubmenu();
  }
}, true); // Utiliser capture phase pour être prioritaire

