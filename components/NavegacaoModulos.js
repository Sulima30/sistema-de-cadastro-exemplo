import Link from 'next/link';

const MenuModulos = ({ items }) => {
  const NavItem = ({ href, label, isActive, isDisabled }) => {
    return (
      <li className="nav-item">
        <Link href={href} passHref style={{ textDecoration: "none" }}>
          <span className="nav-link" aria-current={isActive ? 'page' : null}>
            {label}
          </span>
        </Link>
      </li>
    );
  };
  return (
    <ul className="nav nav-tabs bg-sistem">
      {items.map((item, index) => (
        <NavItem key={index} href={item.href} label={item.label} isActive={item.isActive} isDisabled={item.isDisabled} />
      ))}
    </ul>
  );
};

export default MenuModulos;