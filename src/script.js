let placed = false;

interact('.draggable').draggable({
  inertia: true,
  listeners: {
    move(event) {
      const target = event.target;

      // Position berechnen
      const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
      const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

      // Transform anwenden
      target.style.transform = `translate(${x}px, ${y}px)`;
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    }
  }
});

interact('.dropzone').dropzone({
  accept: '.draggable',
  overlap: 0.25,
  ondrop(event) {
    const dragged = event.relatedTarget;
    const dropTarget = event.target;

    const dropPart = dropTarget.getAttribute('data-part');
    const dragPart = dragged.getAttribute('data-part');

    if (dropPart === dragPart && !placed) {
      dropTarget.innerHTML = ''; // leeren
      dropTarget.appendChild(dragged);

      // Position zurücksetzen
      dragged.style.transform = '';
      dragged.setAttribute('data-x', 0);
      dragged.setAttribute('data-y', 0);

      placed = true;
    }
  }
});
