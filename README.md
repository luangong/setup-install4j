# setup-install4j

[![CI](https://github.com/luangong/setup-install4j/actions/workflows/ci.yml/badge.svg)](https://github.com/luangong/setup-install4j/actions/workflows/ci.yml)

This action provides the following functionality for GitHub Actions runners:

- Downloading and setting up a requested version of [install4j](https://www.ej-technologies.com/products/install4j/overview.html)
- Caching downloaded JRE bundles

After setting up install4j, its bin directory will be added to PATH, so you can run commands like `createbundle` or `install4jc` directly.

Note that by default the install4j is installed to a major-version-dependent directy like `/opt/install4j10`, but this action installs the install4j to a major-version-independent directory so that your build script doesn’t need to worry about which install4j version is installed to what directory.  Specifically, the installation directory for each platform is as follows:

- Linux: `/opt/install4j`
- macOS: `/Applications/install4j.app`
- Windows: `C:\Program Files\install4j`

## Usage

```yml
steps:
  - uses: luangong/setup-install4j@v1
    with:
      version: 10.0.4
      license: ${{ secrets.INSTALL4J_LICENSE }}
```

Currently, install4j v9 and newer are supported.

Also note that you need to specify the exact version number of install4j.  Semantic version numbers such as `10.x` will be supported in a future release.  For the list of all available versions please refer to [this page](https://www.ej-technologies.com/download/install4j/changelog.html).

If you’re using Maven and the [install4j Maven plugin](https://www.ej-technologies.com/resources/install4j/help/doc/cli/maven.html) to build your project, you can specify the installtion directory of install4j in `pom.xml` like this:

```xml
<pluginRepositories>
  <pluginRepository>
    <id>ej-technologies</id>
    <url>https://maven.ej-technologies/repository</url>
  </pluginRepository>
</pluginRepositories>

<build>
  <plugins>
    <plugin>
      <groupId>com.install4j</groupId>
      <artifactId>install4j-maven</artifactId>
      <version>10.0.4</version>
      <executions>
        <execution>
          <id>generate-installer(s)</id>
          <phase>package<phase>
          <goals>
            <goal>compile</goal>
          </goals>
          <configuration>
            <installDir>/opt/install4j</installDir>
            <!-- Other configuration options go here -->
          </configuration>
        <execution>
      </executions>
    </plugin>
  </plugins>
</build>
```

You can also specify the install4j installation directory on the command line:

```bash
mvn -Dinstall4j.home=/opt/install4j package
```

<!--
### Caching JREs

The action has a built-in functionality for caching and restoring JREs for bundling.  It uses [actions/cache](https://github.com/actions/cache) under the hood for caching JRE bundles but requires less configuration settings.  See the [JRE Bundles](https://www.ej-technologies.com/resources/install4j/help/doc/concepts/jreBundles.html) section of the official documentation for more details.
-->

## TODOs

- [ ] Handle semantic version specifications
- [ ] Implement caching of downloaded JREs
- [ ] Take advantage of tool cache
- [ ] Cleaning up
