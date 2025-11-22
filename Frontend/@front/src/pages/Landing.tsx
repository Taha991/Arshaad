import { Section } from '../components/organisms/Section'
import { Button } from '../components/atoms/Button'
import { useNavigate } from 'react-router-dom'

export function Landing() {
  const navigate = useNavigate()
  return (
    <div>
      <section className="bg-gradient-to-br from-brand-50 to-white border-b">
        <div className="container-xl py-16 sm:py-20">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900">Find your path, own your future</h1>
          <p className="mt-4 text-lg text-gray-700 max-w-2xl">A platform to help students discover the right track, understand market opportunities, and follow curated roadmaps to success.</p>
          <div className="mt-6 flex gap-3">
            <Button onClick={() => navigate('/path')}>Know Your Path</Button>
            <Button onClick={() => navigate('/login')} className="bg-white text-brand-700 border border-brand-600 hover:bg-brand-50">Login</Button>
          </div>
        </div>
      </section>

      <Section id="about" title="About Us">
        <p>We guide students through career exploration, skills development, and real-world opportunities using data-driven insights and mentor-led roadmaps.</p>
      </Section>

      <Section id="who" title="Who We Are">
        <p>We are educators, engineers, and career coaches united to simplify the journey from learning to earning.</p>
      </Section>

      <Section id="market" title="See Market">
        <p>Explore trending roles, required skills, and salary ranges across industries.</p>
        <div className="mt-4">
          <Button onClick={() => navigate('/market')}>Explore Opportunities</Button>
        </div>
      </Section>

      <Section id="roadmaps" title="Our Roadmaps">
        <p>Follow structured, step-by-step plans designed by experts to build in-demand skills.</p>
        <div className="mt-4">
          <Button onClick={() => navigate('/roadmaps')}>View Roadmaps</Button>
        </div>
      </Section>
    </div>
  )
}