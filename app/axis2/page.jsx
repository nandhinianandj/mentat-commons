import React from 'react';
import ShieldText from '../../components/ShieldText';

export default function Axis2Page(){
  return (
    <div className="container">
      <h2 className="text-2xl font-bold">Axis II — Mentat Theatre</h2>
      <ShieldText className="mt-2">Using story, theatre, and improv for cultural transformation, restorative practices, and learning design.</ShieldText>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="card">
          <h4 className="font-semibold">Writing</h4>
          <ShieldText className="mt-2">Fiction & non-fiction as inquiry — internal WordPress journal and commissioned essays.</ShieldText>
          <a className="cta mt-3 inline-block" href="/axis2/writing">Read →</a>
        </div>

        <div className="card" style={{borderTop: '4px solid var(--accent-theatre)'}}>
          <h4 className="font-semibold">Theatre of the Oppressed</h4>
          <ShieldText className="mt-2">Workshops for restorative dialogue, conflict transformation, and community practice.</ShieldText>
          <a className="cta mt-3 inline-block" href="/axis2/theatre-facilitation">Read →</a>
        </div>

        <div className="card">
          <h4 className="font-semibold">Applied Improv</h4>
          <ShieldText className="mt-2">Corporate and organizational modules to build adaptability and creative collaboration.</ShieldText>
          <a className="cta mt-3 inline-block" href="/axis2/applied-improv">Read →</a>
        </div>
      </div>
    </div>
  );
}
