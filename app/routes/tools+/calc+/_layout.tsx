import { Outlet, useLocation } from '@remix-run/react';
import { Container } from '#app/components/container.tsx';
import { Spacer } from '#app/components/spacer.tsx';
import { TopSection } from '#app/components/top-section.tsx';

const Tools = new Map<string, string>([
  ['/tools/calc/trade', 'トレード価格計算機'],
  ['/tools/calc/weapon/enhancement', 'Weapon Enhancement price calculator'],
]);

export default function ToolRouteLayout() {
  const location = useLocation();

  return (
    <Container>
      <Spacer size={'xs'} />
      <TopSection className='h-60'>
        <div className='text-white font-bold text-3xl'>
          {Tools.get(location.pathname)}
        </div>
      </TopSection>
      <Spacer size={'4xs'} />
      <Outlet />
    </Container>
  );
}
