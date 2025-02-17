// src/utils/military/effects.ts
export const triggerFiringEffect = (tankElement: HTMLElement) => {
    const firingEffect = tankElement.querySelector('.firing-effect');
    if (firingEffect) {
      firingEffect.classList.remove('hidden');
      firingEffect.classList.add('active');
      
      setTimeout(() => {
        firingEffect.classList.remove('active');
        firingEffect.classList.add('hidden');
      }, 200);
    }
  };