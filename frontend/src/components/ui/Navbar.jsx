import React from "react";
import { Navbar as FlowbiteNavbar, Button, ButtonGroup } from "flowbite-react";
import { Icon } from "@iconify-icon/react";

const Navbar = () => {
  return (
    <FlowbiteNavbar fluid className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <FlowbiteNavbar.Brand href="/">
        <img
          src="logo.svg"
          className="h-10 w-10 mr-3"
          alt="Logo StudentPlanner"
        />
        <span className="text-xl font-semibold text-gray-900">
          StudentPlanner
        </span>
      </FlowbiteNavbar.Brand>

      <div className="flex md:order-2">
        <ButtonGroup className="hidden md:flex">
          <Button color="default" href="/register" className="hidden md:block">
            <Icon
              icon="tabler:user-plus"
              className="mr-2"
              width={20}
              height={20}
            />
            S'inscrire
          </Button>
          <div className="w-px mx-0.1 bg-gray-300"></div>
          <Button color="default" href="/login" className="hidden md:block">
            <Icon icon="tabler:login" className="mr-2" width={20} height={20} />
            Se connecter
          </Button>
        </ButtonGroup>
        <FlowbiteNavbar.Toggle className="md:hidden" />
      </div>

      <FlowbiteNavbar.Collapse>
        <FlowbiteNavbar.Link
          href="/dashboard"
          className="md:text-gray-700 hover:text-indigo-600"
        >
          Tableau de bord
        </FlowbiteNavbar.Link>
        <FlowbiteNavbar.Link
          href="#about"
          className="md:text-gray-700 hover:text-indigo-600"
        >
          A propos
        </FlowbiteNavbar.Link>
        <FlowbiteNavbar.Link
          href="/contact"
          className="md:text-gray-700 hover:text-indigo-600"
        >
          Contact
        </FlowbiteNavbar.Link>

        <div className="md:hidden mt-2 pt-2 border-t border-gray-200">
          <Button color="default" href="/register" className="w-full">
            S'inscrire
          </Button>
        </div>
      </FlowbiteNavbar.Collapse>
    </FlowbiteNavbar>
  );
};

export default Navbar;
