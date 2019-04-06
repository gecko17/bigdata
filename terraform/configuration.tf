provider "openstack" {
  user_name   = "wikw14_10"
  tenant_id   = "034fff4ff24444a9a5645003146757be"
  password    = "wikw14_10!"
  auth_url    = "http://controller.4c.dhbw-mannheim.de:5000/v3"
  region      = "RegionOne"
  domain_name = "default"
}

resource "openstack_compute_instance_v2" "basic" {
  name            = "comp10"
  image_id        = "c24a6ba4-db4e-4c53-934e-41b3887da8df"
  flavor_name     = "m1.small"
  key_pair        = "sshkey10"
  security_groups = ["default"]

  network {
    name = "net25"
  }
}

resource "openstack_networking_floatingip_v2" "floatip_1" {
  pool = "ext-net-201"
}

resource "openstack_compute_floatingip_associate_v2" "fip_1" {
  floating_ip = "${openstack_networking_floatingip_v2.floatip_1.address}"
  instance_id = "${openstack_compute_instance_v2.basic.id}"
}

resource "local_file" "floating_ip" {
  content  = "${openstack_networking_floatingip_v2.floatip_1.address}"
  filename = "${path.module}/terraform-openstack-host"
}
