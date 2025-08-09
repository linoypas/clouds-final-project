locals {
    vpc_name = "traveler-project"
    local_vpc_cidr_block = "20.0.0.0/16"
    public_subnets = ["20.0.0.0/20", 20.0.16.0/20", "20.10.32.0/20"]
    common_tags = {
        project = "traveler
    }
    ec2_key_name = "traveler"
    app_ami = ""
    instance_type = "t3.micro"
}