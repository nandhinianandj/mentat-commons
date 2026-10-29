import React from 'react';
import ShieldText from '../../components/ShieldText';

export default function Axis1Page() {
  return (
    <div className="container">
      {/* Primary SEO Heading */}
      <h2 className="text-2xl font-bold">Axis I — Systems & Decision Design</h2>
      
      <ShieldText className="mt-2">Helping organizations make better decisions with data they can trust</ShieldText>

      <ShieldText className="mt-4">Most organizations don’t struggle because they lack data or tools. They struggle because decisions are unclear, information arrives too late, or systems optimize the wrong behavior.</ShieldText>

      <ShieldText className="mt-4">Axis I focuses on designing decision systems — the combination of data, models, metrics, and organizational processes that determine how choices are made in practice.</ShieldText>

      <section className="mt-6">
        <h3 className="font-semibold">What This Covers</h3>
        <ShieldText className="mt-2">Axis I work typically includes:</ShieldText>
        <ul className="mt-2 list-disc list-inside">
          <li><ShieldText as="span">data and AI/ML system design,</ShieldText></li>
          <li><ShieldText as="span">decision diagnostics and redesign,</ShieldText></li>
          <li><ShieldText as="span">metrics, incentives, and feedback loops,</ShieldText></li>
          <li><ShieldText as="span">research and frameworks for complex environments.</ShieldText></li>
        </ul>
        <ShieldText className="mt-2">The emphasis is not on tools alone, but on how decisions move through the organization.</ShieldText>
      </section>

      <section className="mt-6">
        <h3 className="font-semibold">How We Work</h3>
        <ShieldText className="mt-2">Start with diagnosis, not solutions.</ShieldText>
        <ShieldText className="mt-2">Every engagement begins by identifying:</ShieldText>
        <ul className="mt-2 list-disc list-inside">
          <li><ShieldText as="span">which decisions matter most,</ShieldText></li>
          <li><ShieldText as="span">how they are currently made,</ShieldText></li>
          <li><ShieldText as="span">where information, authority, or incentives break down,</ShieldText></li>
          <li><ShieldText as="span">and what prevents learning from outcomes.</ShieldText></li>
        </ul>
        <ShieldText className="mt-2">Only then do we design or implement systems.</ShieldText>
      </section>

      <section className="mt-6">
        <h3 className="font-semibold">Core Engagements</h3>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <div className="card">
            <h4 className="font-semibold">Data, AI & ML Systems</h4>
            <ShieldText className="mt-2">Build systems teams can understand, maintain, and act on.</ShieldText>
            <ShieldText className="mt-2">End-to-end data pipelines tied to decision workflows</ShieldText>
            <ShieldText className="mt-2">ML models with clear assumptions, limits, and monitoring</ShieldText>
            <ShieldText className="mt-2">Integration into real processes, not unused dashboards</ShieldText>
            <ShieldText className="mt-2"><strong>Outcome:</strong> faster decision cycles, fewer black boxes, higher adoption.</ShieldText>
          </div>
          <div className="card">
            <h4 className="font-semibold">Decision Systems & Organizational Design</h4>
            <ShieldText className="mt-2">Make decision-making explicit and improvable.</ShieldText>
            <ShieldText className="mt-2">Map how key decisions are actually made</ShieldText>
            <ShieldText className="mt-2">Identify bottlenecks in information, ownership, or incentives</ShieldText>
            <ShieldText className="mt-2">Redesign decision rights, metrics, and feedback loops</ShieldText>
            <ShieldText className="mt-2"><strong>Outcome:</strong> clearer ownership, fewer stalled discussions, metrics that reflect real priorities.</ShieldText>
          </div>
          <div className="card">
            <h4 className="font-semibold">Research & Thought Leadership</h4>
            <ShieldText className="mt-2">Support long-term thinking under uncertainty.</ShieldText>
            <ShieldText className="mt-2">Focus areas include:</ShieldText>
            <ul className="mt-2 list-disc list-inside">
              <li><ShieldText as="span">decision quality in complex systems,</ShieldText></li>
              <li><ShieldText as="span">collaborative and inclusive decision-making,</ShieldText></li>
              <li><ShieldText as="span">consensus building and negotiated trade-offs,</ShieldText></li>
              <li><ShieldText as="span">learning systems inside institutions.</ShieldText></li>
            </ul>
            <ShieldText className="mt-2"><strong>Outcome:</strong> frameworks that inform strategy, policy, and leadership development.</ShieldText>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <h3 className="font-semibold">Engagement Models</h3>
        <ul className="mt-2 list-disc list-inside">
          <li><strong>Diagnostic (2–8 weeks):</strong> <ShieldText as="span">Clarify decision bottlenecks and recommend focused interventions.</ShieldText></li>
          <li><strong>Delivery & Architecture (3–12 months):</strong> <ShieldText as="span">Design and implement systems teams can own and evolve.</ShieldText></li>
          <li><strong>Embedded Advisory:</strong> <ShieldText as="span">Ongoing support during scale, transition, or restructuring.</ShieldText></li>
        </ul>
      </section>

      <section className="mt-6">
        <h3 className="font-semibold">Who This Is For</h3>
        <ul className="mt-2 list-disc list-inside">
          <li><ShieldText as="span">Startups and scale-ups designing core systems</ShieldText></li>
          <li><ShieldText as="span">NGOs and public-interest organizations balancing impact and accountability</ShieldText></li>
          <li><ShieldText as="span">Policy-adjacent and research teams working with uncertainty</ShieldText></li>
        </ul>
      </section>

      <section className="mt-6">
        <h3 className="font-semibold">How to Start</h3>
        <ShieldText className="mt-2">We begin with one question:</ShieldText>
        <ShieldText className="mt-2 italic">Which decision, if improved, would make the biggest difference right now?</ShieldText>
      </section>
    </div>
  );
}
